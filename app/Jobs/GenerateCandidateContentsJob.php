<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\District;
use App\Models\Candidate;
use App\Services\OpenAiService;

class GenerateCandidateContentsJob implements ShouldQueue
{
    use Queueable;

    private $district = null;

    /**
     * Create a new job instance.
     */
    public function __construct(District $district)
    {
        $this->district = $district;
    }

    /**
     * Execute the job.
     */
    public function handle(OpenAiService $openAiService): void
    {
        \Log::info('GenerateCandidateContentsJob start');
        $history = '';

        foreach ($this->district->election->district as $_district)
        {
            if ($_district->scene)
            {
                $scene = $_district->scene;
                if (strpos($scene, '{') !== false && strpos($scene, '}') !== false) {
                    $data = json_decode($_district->scene, true);
                    $scenes = $data['scene'];
                    foreach ($scenes as $scene)
                    {
                        \Log::info($scene);
                        $history .= $scene."\n";
                    }
                }else{
                    $history .= $scene."\n";
                }
            }

            if ($candidate = $_district->candidate()->first())
            {
                // TODO: 本当は winner を取る
                // $history .= $candidate->name."\n";
                $history .= $_district->winner_candidate->name."\n";
            }
        }
        
        // \Log::info('history: '.$history);

        $choices = $openAiService->generate_choices(
            $this->district->election->theme,
            $history
        );
        

        preg_match_all('/\{.*?\}/s', $choices, $matches);


        // JSON文字列を連想配列に変換
        $data = json_decode($matches[0][0], true);

        // 配列を取り出す
        $choices = $data['choices'];
        

        foreach ($choices as $candidate)
        {
            Candidate::create([
                'district_id' => $this->district->id,
                'name' => $candidate,
            ]);
        }

    }
}

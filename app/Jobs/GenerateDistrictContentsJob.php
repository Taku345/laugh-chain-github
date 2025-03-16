<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\District;
use App\Models\Candidate;
use App\Services\OpenAiService;

class GenerateDistrictContentsJob implements ShouldQueue
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
        // \Log::info('GenerateDistrictContentsJob start');
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
                // \Log::info('D_winner: '.$_district->winner_candidate->name);
            }
        }

        // \Log::info('D_history: '.$history);

        $scene = $openAiService->generate_scene(
            $this->district->election->name,
            $history
        );
        // \Log::info('scene: '.$scene);

        $this->district->scene = $scene;
        $this->district->save();
    }
}

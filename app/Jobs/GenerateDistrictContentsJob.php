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
        $history = '';

        foreach ($this->district->election->district as $_district)
        {
            if ($_district->scene)
            {
                $history .= $_district->scene."\n";
            }

            if ($candidate = $_district->candidate()->first())
            {
                // TODO: 本当は winner を取る
                $histroy = $candidate->name."\n";
            }
        }

        \Log::info('history: '.$history);

        $scene = $openAiService->generate_scene(
            $this->district->election->theme,
            $history
        );
        \Log::info('scene: '.$scene);

        $history .= $scene."\n";
        $choices = $openAiService->generate_choices(
            $this->district->election->theme,
            $history
        );
        \Log::info('choices: '.$choices);

        //
        // 
    }
}

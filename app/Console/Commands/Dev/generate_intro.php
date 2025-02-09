<?php

namespace App\Console\Commands\Dev;

use Illuminate\Console\Command;
use App\Services\OpenAiService;

class generate_intro extends Command
{
    protected $signature = 'generate_intro';
    protected $description = 'AIでテーマと一言目を生成する';

    protected $openAiService;

    // OpenAiServiceを依存注入
    public function __construct(OpenAiService $openAiService)
    {
        parent::__construct();
        $this->openAiService = $openAiService;
    }

    public function handle()
    {
        $result = $this->openAiService->generate_intro();
        $this->info($result);
        
    }
}

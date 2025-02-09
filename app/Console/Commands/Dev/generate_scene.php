<?php

namespace App\Console\Commands\Dev;

use Illuminate\Console\Command;
use App\Services\OpenAiService;

class generate_scene extends Command
{
    protected $signature = 'generate_scene';
    protected $description = 'AIで選択肢間の繋ぎを生成する';

    protected $openAiService;

    // OpenAiServiceを依存注入
    public function __construct(OpenAiService $openAiService)
    {
        parent::__construct();
        $this->openAiService = $openAiService;
    }

    public function handle()
    {
        $result = $this->openAiService->generate_scene();
        $this->info($result);
        
    }
}

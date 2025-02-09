<?php

namespace App\Console\Commands\Dev;

use Illuminate\Console\Command;
use App\Services\OpenAiService;

class generate_choices extends Command
{
    protected $signature = 'generate_choices {theme} {history}';
    protected $description = 'AIで選択肢を生成する';

    protected $openAiService;

    // OpenAiServiceを依存注入
    public function __construct(OpenAiService $openAiService)
    {
        parent::__construct();
        $this->openAiService = $openAiService;
    }

    public function handle()
    {
        $result = $this->openAiService->generate_choices($this->argument('theme'), $this->argument('history'));
        $this->info($result);
        
    }
}

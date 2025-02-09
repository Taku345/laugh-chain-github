<?php

namespace App\Console\Commands\Dev;

use Illuminate\Console\Command;
use App\Services\OpenAiService;

class generate_opening_lines extends Command
{
    protected $signature = 'generate_opening_lines {theme}';
    protected $description = 'AIで一言目を3つ生成する';

    protected $openAiService;

    // OpenAiServiceを依存注入
    public function __construct(OpenAiService $openAiService)
    {
        parent::__construct();
        $this->openAiService = $openAiService;
    }

    public function handle()
    {
        $result = $this->openAiService->generate_opening_lines($this->argument('theme'));
        $this->info($result);
        
    }
}

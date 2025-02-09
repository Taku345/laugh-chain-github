<?php

namespace App\Console\Commands\Dev;

use Illuminate\Console\Command;
use App\Services\OpenAiService;

class generate_opening_line extends Command
{
    protected $signature = 'generate_opening_line {theme}';
    protected $description = 'AIで一言目を1つ生成する';

    protected $openAiService;

    // OpenAiServiceを依存注入
    public function __construct(OpenAiService $openAiService)
    {
        parent::__construct();
        $this->openAiService = $openAiService;
    }

    public function handle()
    {
        $result = $this->openAiService->generate_opening_line($this->argument('theme'));
        $this->info($result);
        
    }
}

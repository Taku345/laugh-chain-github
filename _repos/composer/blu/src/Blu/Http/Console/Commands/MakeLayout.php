<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Console\GeneratorCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MakeLayout extends GeneratorCommand
{
    protected $signature = 'blu:layout';

    public function handle()
    {
        file_put_contents(base_path('resources/ts/Layouts/Layout.tsx'), file_get_contents($this->getStub()));
    }

    protected function getStub()
    {
        return $this->resolveStubPath('/stubs/ts/Layout.stub');
    }


    // 中身同じだが、親の呼び出しで __DIR__ の指すパスが異なるので、override
    protected function resolveStubPath($stub)
    {
        return file_exists($customPath = $this->laravel->basePath(trim($stub, '/')))
                        ? $customPath
                        : __DIR__.$stub;
    }
}
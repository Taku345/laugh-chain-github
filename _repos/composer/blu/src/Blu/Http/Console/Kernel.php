<?php
namespace Blu\Http\Console;

use Symfony\Component\Finder\Finder;
use Illuminate\Console\Application as Artisan;
use Illuminate\Console\Command;

class Kernel
{
    public function __invoke()
    {
        stataic::load();
    }

    public static function load()
    {
        $paths = __dir__.'/Commands';

        $paths = array_unique(\Arr::wrap($paths));

        $paths = array_filter($paths, function ($path) {
            return is_dir($path);
        });

        if (empty($paths)) {
            return;
        }

        $namespace = '\Blu\Http\Console\\';

        foreach ((new Finder)->in($paths)->files() as $command) {
            $command = $namespace.str_replace(
                ['/', '.php'],
                ['\\', ''],
                \Str::after($command->getRealPath(), realpath(__DIR__).DIRECTORY_SEPARATOR)
            );

            if (is_subclass_of($command, Command::class) &&
                ! (new \ReflectionClass($command))->isAbstract()) {
                Artisan::starting(function ($artisan) use ($command) {
                    $artisan->resolve($command);
                });
            }
        }
    }
}
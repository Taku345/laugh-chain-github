<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Console\ModelMakeCommand;
use Illuminate\Console\GeneratorCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MakeRouting extends GeneratorCommand
{
    protected $name = 'blu:routing';

    public function handle()
    {
        $config = config($this->argument('config'));
        if (!$config) return false;

        $this->argument('name');

        $use = 'use App\Http\Controllers\\'.str_replace('/', '\\', $this->argument('name')).'Controller;';
        $routeName = preg_replace(['/\.config$/i', '/^[^\.]+\./'], ['', ''], $this->argument('config'));
        $routePath = str_replace('.', '/', $routeName);
        $controller = \Str::AfterLast($this->argument('name'), '/').'Controller';


        $file_content = file_get_contents(base_path('routes/web.php'));
        $useFirst = \Str::before(\Str::after($file_content, "use"), ";");
        $routing = $this->argument('softDelete') ? "\Blu\Routing::softDelete('".$routePath."', ".$controller."::class, '".$routeName."');" :
            "\Blu\Routing::crud('".$routePath."', ".$controller."::class, '".$routeName."');";
        file_put_contents(base_path('routes/web.php'), str_replace(
            $useFirst,
            $useFirst.";\n".$use,
            $file_content
        )."\n".$routing);

        $file_content = file_get_contents(base_path('routes/api.php'));
        $useFirst = \Str::before(\Str::after($file_content, "use"), ";");
        $routing = $this->argument('softDelete') ? "\Blu\Routing::apiSoftDelete('".$routePath."', ".$controller."::class, 'api.".$routeName."');":
            "\Blu\Routing::api('".$routePath."', ".$controller."::class, 'api.".$routeName."');";
        file_put_contents(base_path('routes/api.php'), str_replace(
            $useFirst,
            $useFirst.";\n".$use,
            $file_content
        )."\n".$routing);


        // typescript
        if (!file_exists(base_path('resources/ts/Layouts/menu.ts')))
        {
            file_put_contents(base_path('resources/ts/Layouts/menu.ts'), file_get_contents($this->resolveStubPath('/stubs/ts/menu.stub')));
        }

        $fileContent = file_get_contents(base_path('resources/ts/Layouts/menu.ts'));
        $menuItem = $this->argument('softDelete') ? file_get_contents($this->resolveStubPath('/stubs/ts/menu-item.softdelete.stub')):
            file_get_contents($this->resolveStubPath('/stubs/ts/menu-item.stub'));
        $menuItem = str_replace(
            '{{ viewName }}',
            $this->argument('viewName'),
            $menuItem
        );
        $menuItem = str_replace(
            '{{ route }}',
            $routeName,
            $menuItem
        );

        file_put_contents(base_path('resources/ts/Layouts/menu.ts'), \Str::beforeLast($fileContent, '}').$menuItem."\n}");
    }

    protected function getStub()
    {
    }


    // 中身同じだが、親の呼び出しで __DIR__ の指すパスが異なるので、override
    protected function resolveStubPath($stub)
    {
        return file_exists($customPath = $this->laravel->basePath(trim($stub, '/')))
                        ? $customPath
                        : __DIR__.$stub;
    }

    protected $type = 'Routing';


    protected function getArguments()
    {
        return [
            ['config', InputArgument::REQUIRED, 'The config of the '.strtolower($this->type)],
            ['name', InputArgument::REQUIRED, 'The name of the '.strtolower($this->type)],
            ['viewName', InputArgument::REQUIRED, 'The view name of the '.strtolower($this->type)],
            ['softDelete', InputArgument::OPTIONAL, 'is SoftDelete of the '.strtolower($this->type)],
        ];
    }
}
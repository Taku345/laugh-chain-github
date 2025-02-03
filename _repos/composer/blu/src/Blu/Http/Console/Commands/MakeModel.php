<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Console\ModelMakeCommand;
use Illuminate\Console\GeneratorCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MakeModel extends ModelMakeCommand
{
    protected $name = 'blu:model';

    public function handle()
    {
        $config = config($this->argument('config'));
        if (!$config) return false;

        if (parent::handle() === false && ! $this->option('force')) {
            return false;
        }
    }

    protected function buildClass($name)
    {
        $config = config($this->argument('config'));

        $stub = parent::buildClass($name);

        $className = class_basename($this->argument('name'));
        $thisName = \Str::singular(\Str::snake(\Str::pluralStudly($className)));

        // {{ with }}
        // {{ relations }}
        $imports = "";
        $with = [];
        $relations = "";
        $appends = [];
        $attributes = "";
        foreach ($config as $fieldName => $field)
        {
            switch ($type = \Arr::get($field, 'type', null))
            {
                case 'belongsTo':
                case 'hasOne':
                case 'hasMany':
                case 'belongsToMany':
                    if (strpos($imports, "use Illuminate\Database\Eloquent\Relations\\".\Str::studly($type)) === false)
                    {
                        $imports .= "use Illuminate\Database\Eloquent\Relations\\".\Str::studly($type).";\n";
                    }
                    $with[] = $fieldName;
                    $relations .= "
    public function ".$fieldName."(): ".\Str::studly($type)."
    {
        return \$this->".$type."(".\Str::studly($fieldName)."::class)->withOut('".$thisName."');
    }\n";
                    break;
            }

            if ($attribute = \Arr::get($field, 'attribute', null))
            {
                $appends[] = $attribute;
                $attributeName = 'get'.\Str::studly($attribute).'Attribute';
                $attributes .= "
    public function getCollectDetailTextAttribute()
    {
        /* TODO: return attribute value */
        // return \$this->".$fieldName.";
    }\n";
            }
        }

        $stub = str_replace('{{ imports }}', $imports, $stub);
        if (count($with) > 0)
        {
            $stub = str_replace('{{ with }}', "\n    protected \$with = ".
                "['".implode("', '", $with)."'];", $stub);
        }
        else
        {
            $stub = str_replace('{{ with }}', "", $stub);
        }
        $stub = str_replace('{{ relations }}', $relations, $stub);

        // {{ appends }}
        // {{ attributes }}
        if (count($appends) > 0)
        {
            $stub = str_replace('{{ appends }}', "\n    protected \$appends = ".
                "['".implode("', '", $appends)."'];", $stub);
        }
        else
        {
            $stub = str_replace('{{ appends }}', "", $stub);
        }
        $stub = str_replace('{{ attributes }}', $attributes, $stub);

        return $stub;
    }

    protected function getStub()
    {
        if ($this->option('pivot')) {
            return $this->resolveStubPath('/stubs/model.pivot.stub');
        }

        if ($this->option('morph-pivot')) {
            return $this->resolveStubPath('/stubs/model.morph-pivot.stub');
        }

        if ($this->argument('softDelete')) {
            return $this->resolveStubPath('/stubs/model.softDelete.stub');
        }

        return $this->resolveStubPath('/stubs/model.stub');
    }


    // 中身同じだが、親の呼び出しで __DIR__ の指すパスが異なるので、override
    protected function resolveStubPath($stub)
    {
        return file_exists($customPath = $this->laravel->basePath(trim($stub, '/')))
                        ? $customPath
                        : __DIR__.$stub;
    }


    protected function getArguments()
    {
        return [
            ['config', InputArgument::REQUIRED, 'The config of the '.strtolower($this->type)],
            ['name', InputArgument::REQUIRED, 'The name of the '.strtolower($this->type)],
            ['softDelete', InputArgument::OPTIONAL, 'is SoftDelete of the '.strtolower($this->type)],
        ];
    }

    protected function getOptions()
    {
        $options = parent::getOptions();
        $options[] = ['typescript', 't', InputOption::VALUE_REQUIRED, 'Create TypeScript files'];
        return $options;
    }


    /**
     * Create a controller for the model.
     *
     * @return void
     */
    protected function createController()
    {
        $controller = \Str::studly(class_basename($this->argument('name')));

        $modelName = $this->qualifyClass($this->getNameInput());

        $this->call('blu:controller', array_filter([
            'config' => $this->argument('config'),
            'name' => "{$controller}Controller",
            '--model' =>  $modelName,
            '--api' => $this->option('api'),
            '--force' => $this->option('force'),
            '--requests' => $this->option('requests') || $this->option('all') || $this->option('controller'),
        ]));
    }


    protected function createMigration()
    {
        $table = \Str::snake(\Str::pluralStudly(class_basename($this->argument('name'))));

        if ($this->option('pivot')) {
            $table = \Str::singular($table);
        }

        $this->call('blu:migration', [
            'config' => $this->argument('config'),
            'name' => "create_{$table}_table",
            '--create' => $table,
            '--fullpath' => true,
        ]);
    }
}
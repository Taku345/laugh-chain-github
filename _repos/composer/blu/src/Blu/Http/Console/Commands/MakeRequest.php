<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Console\RequestMakeCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MakeRequest extends RequestMakeCommand
{
    protected $name = 'blu:request';

    protected function getArguments()
    {
        return [
            ['config', InputArgument::REQUIRED, 'The config of the '.strtolower($this->type)],
            ['name', InputArgument::REQUIRED, 'The name of the '.strtolower($this->type)],
        ];
    }

    protected function buildClass($name)
    {
        $config = config($this->argument('config'));

        $stub = parent::buildClass($name);

        $rules = "";

        foreach ($config as $fieldName => $field)
        {
            $type = \Arr::get($field, 'type', null);
            
            $validations = [];
            if ($fieldName == 'id') continue;
            if (in_array($type, ['belongsToMany', 'hasOne', 'hasMany'])) continue;

            switch ($type)
            {
            case 'raw':
            case 'order':
                $validations[] = 'integer';
                break;
            case 'textarea':
            case 'radio':
            case 'select':
            case 'reference':
            case 'checkbox':
            case 'belongsTo':
                break;
            case 'date':
            case 'datetime-local':
            case 'time':
                $validations[] = 'date';
                break;
            case 'number':
                $validations[] = 'numeric';
                break;

            case 'email':
                $validations[] = 'email';
            case 'text':
            case 'password':
            case 'tel':
                $validations[] = 'max:255';
                break;
            default:
                break;
            }


            if ($type != 'order')
            {
                if (\Arr::get($field, 'required', false))
                {
                    $validations[] = 'required';
                }
                else if (count($validations) > 0)
                {
                    $validations[] = 'nullable';
                }
            }

            if (count($validations) > 0)
            {
                $rules .= "
            '".$fieldName."' => ['".implode(', ', $validations)."'],";
            }
        }

        $stub = str_replace('{{ rules }}', $rules, $stub);


        return $stub;
    }


    protected function resolveStubPath($stub)
    {
        return file_exists($customPath = $this->laravel->basePath(trim($stub, '/')))
                        ? $customPath
                        : __DIR__.$stub;
    }
}
<?php
namespace Blu\Http\Console\Misc;

use Illuminate\Database\Migrations\MigrationCreator as ParentMigrationCreator;

class MigrationCreator extends ParentMigrationCreator
{
    protected $config = [];
    protected $softDelete = false;

    public function setConfig($config)
    {
        $this->config = $config;
    }

    public function setSoftDelete($softDelete)
    {
        $this->softDelete = $softDelete;
    }


    protected function getStub($table, $create)
    {
        if ($this->softDelete)
        {
            return $this->files->get($this->stubPath().'/migration.softDelete.stub');
        }
        return $this->files->get($this->stubPath().'/migration.stub');
    }

    /**
     * Get the path to the stubs.
     *
     * @return string
     */
    public function stubPath()
    {
        return dirname(__DIR__).'/Commands/stubs';
    }

    /**
     * Populate the place-holders in the migration stub.
     *
     * @param  string  $stub
     * @param  string|null  $table
     * @return string
     */
    protected function populateStub($stub, $table)
    {
        $stub = parent::populateStub($stub, $table);

        $columns = [];
        foreach ($this->config as $fieldName => $field)
        {
            $column = "\$table->";

            $type = \Arr::get($field, 'type', null);
            
            if ($fieldName == 'id') continue;
            if (in_array($type, ['belongsToMany', 'hasOne', 'hasMany'])) continue;

            switch ($type)
            {
            case 'raw':
                $column.="{raw}('".$fieldName."')";
                break;
            case 'order':
                $column.="integer('".$fieldName."')->default(0)";
                break;
            case 'textarea':
                $column.="text('".$fieldName."')";
                break;
            case 'radio':
            case 'select':
            case 'reference':
                if (is_numeric(\Arr::get($field, 'default', null)))
                {
                    $column.="integer('".$fieldName."')";
                }
                else
                {
                    $column.="string('".$fieldName."')";
                }
                break;
            case 'checkbox':
                $column.="{checkbox}('".$fieldName."')";
                break;
            case 'belongsTo':
                $column.="unsignedBigInteger('".(substr($fieldName, -3) == '_id' ? $fieldName : $fieldName.'_id')."')";
                break;
            case 'date':
                $column.="date('".$fieldName."')";
                break;
            case 'datetime-local':
                $column.="datetime('".$fieldName."')";
                break;
            case 'time':
                $column.="time('".$fieldName."')";
                break;
            case 'number':
                $column.="{number}('".$fieldName."')";
                break;

            case 'text':
            case 'password':
            case 'email':
            case 'tel':
                $column.="string('".$fieldName."')";
                break;
            default:
                $column.="{undefined}('".$fieldName."')";
                break;
            }

            if (!\Arr::get($field, 'required', false) && $type != 'order')
            {
                $column.="->nullable()->default(null)";
            }

            $columns[] = "
            ".$column.";";
        }

        $stub = str_replace('{{ columns }}', implode('', $columns), $stub);

        return $stub;
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Candidate extends Model
{
    protected $guarded = ['id', 'created_at', 'updataed_at'];
    //

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class)
            ->withOut('candidate');
    }


    public function vote(): HasMany
    {
        return $this->hasMany(Vote::class)
            ->withOut('candidate');
    }

    public function my_vote(): HasMany
    {
        return $this->hasMany(Vote::class)
            ->where('public_key', \Auth('symbol')->user() ? \Auth('symbol')->user()->public_key : null)
            ->withOut('candidate');
    }
}

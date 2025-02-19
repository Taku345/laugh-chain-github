<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $election_id
 * @property string|null $scene シーン説明
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class District extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class)
            ->withOut('district');
    }

    public function candidate(): HasMany
    {
        return $this->hasMany(Candidate::class)
            ->orderBy('created_at', 'ASC')
            ->withOut('district');
    }


    public function scopePublic($query)
    {
        return $query->whereHas('election', function ($q) { $q->public();} );
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Collection;


class Election extends Model
{

    protected $guarded = ['id', 'created_at', 'updated_at'];

    /*
    protected $with = ['candidate'];
    */
    protected $appends = ['status'];

    public function district(): HasMany
    {
        return $this->hasMany(District::class)
            ->orderBy('created_at', 'ASC')
            ->withOut('election');
    }


    public function scopePublic($query)
    {
        return $query->where('is_public', true);

    }

    public function scopeScheduled($query)
    {
        return $query->public()
            ->where(function ($query)
            {
                $query->whereNotNull('scheduled_at')
                    ->where('scheduled_at', '<=', date('Y-m-d H:i:s'));
                $query->whereDoesntHave('district');
            });
    }


    public function scopeBefore($query)
    {
        return $query->public()
            ->where(function ($query)
            {
                $query->where(function ($query)
                {
                    $query->whereNotNull('scheduled_at')
                        ->where('scheduled_at', '<=', date('Y-m-d H:i:s'));
                })
                ->orWhere(function ($query)
                {
                    $query->whereDoesntHave('district');
                });
            });
    }

    public function scopeOpen($query)
    {
        return $query->public()
            ->where(function ($query)
            {
                $query->whereNull('scheduled_at')
                    ->orWhere('scheduled_at', '>=', date('Y-m-d H:i:s'));
            })
            ->whereHas('district', function ($query)
            {
                $query->where('progress', '<', config('laugh_chain.district.progress.close'));
            });
    }

    public function scopeClese($query)
    {
        return $query->public()
            ->where(function ($query)
            {
                $query->whereNull('scheduled_at')
                    ->orWhere('scheduled_at', '>=', date('Y-m-d H:i:s'));
            })
            ->whereDoesntHave('district', function ($q)
            {
                $q->where('progress', '<', config('laugh_chain.district.progress.close'));
            });
    }

    public static $status = [
        'private' => '非公開',
        'before' => '開催前',
        'open' => '開催中',
        'close' => '終了',
    ];

    public function getStatusAttribute()
    {
        if (!$this->is_public)
            return 'private';

        if (
            $this->scheduled_at &&
            strtotime($this->scheduled_at) < strtotime(now()) ||
            $this->district->count() < 1
        )
            return 'before';

        if ($this->district()->where('progress', '<', config('laugh_chain.district.progress.close'))->count() > 0)
            return 'open';

        return 'close';
    }

    /**
     * winner_candidateに対し最も連打したユーザーをbest_userとする
     */
    public function getBestUserPublicKeyAttribute()// User
    {
        // $district->Election_idに関する全districtを取得する
        $districts = District::where('election_id', $this->id)->get();
        $winner_candidate_ids = [];
        foreach ($districts as $district) {
            $winner_candidate_ids[] = $district->winner_candidate->id;
        }
        $public_key = Vote::whereIn('candidate_id', $winner_candidate_ids)
            ->select('public_key')
            ->selectRaw('SUM(rate) as total_rate')
            ->groupBy('public_key')
            ->orderByDesc('total_rate')
            ->get();
        // dd($public_key);

        return $public_key ? $public_key->first()->public_key : null;
    }

}

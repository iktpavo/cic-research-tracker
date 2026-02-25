<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Team extends Model
{
    protected $table = 'teams';

    protected $fillable = [
        'research_id',
        'member_id',
    ];

    // Get the research that this team belongs to.
    public function research(): BelongsTo
    {
        return $this->belongsTo(Research::class);
    }


    // Get the member that this team belongs to.
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}

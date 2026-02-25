<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Author extends Model
{
    protected $table = 'authors';

    protected $fillable = [
        'publication_id',
        'member_id',
    ];

    // Get the publication that these authors belong to
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class);
    }

    // Get the members that authored this
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}

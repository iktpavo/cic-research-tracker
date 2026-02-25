<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Publication extends Model
{
    use HasFactory;
    protected $fillable = [
        'publication_title',
        'journal',
        'publication_year',
        'publication_program',
        'isbn',
        'p-issn',
        'e-issn',
        'publisher',
        'online_view',
        'incentive_file',
        //new
        'product_file',
        'patent_file',
    ];

    // Get the members that belong to this research publication.
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'authors')->withTimestamps();
    }
}

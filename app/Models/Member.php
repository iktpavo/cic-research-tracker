<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Member extends Model
{
    use HasFactory;
    protected $fillable = [
        'full_name',
        'rank',
        'designation',
        'member_program',
        'member_email',
        'orcid',
        'telephone',
        'educational_attainment',
        'specialization',
        'research_interest',
        'profile_photo',
        'teaches_grad_school',
    ];


    // Get the research projects that this member belongs to..
    public function research(): BelongsToMany
    {
        return $this->belongsToMany(Research::class, 'teams')->withTimestamps();
    }

    // Get the publications that this member belongs to
    public function publication(): BelongsToMany
    {
        return $this->belongsToMany(Publication::class, 'authors')->withTimestamps();
    }


    // get ongoing researches count
    public function ongoingResearches()
    {
        return $this->research()->where('status', 'ongoing');
    }


    public function getOngoingResearchCountAttribute()
    {
        return $this->ongoingResearches()->count();
    }

    // get completed researches count
    public function completedResearches()
    {
        return $this->research()->where('status', 'completed');
    }


    public function getCompletedResearchCountAttribute()
    {
        return $this->completedResearches()->count();
    }

    // get publication count of a memmber
    public function getPublicationCountAttribute()
    {
        return $this->publication()->count();
    }
}

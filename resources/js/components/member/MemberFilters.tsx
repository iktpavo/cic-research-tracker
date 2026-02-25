import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal } from "lucide-react";
import { MemberFilterData } from "@/types/filters";
import { Checkbox } from "@/components/ui/checkbox";

interface MemberFiltersProps {
  filters: MemberFilterData;
  setFilters: (filters: MemberFilterData) => void;
  onFilter: (filters: MemberFilterData) => void;
}

export default function MemberFilters({
  filters,
  setFilters,
  onFilter,
}: MemberFiltersProps) {
  const [localFilters, setLocalFilters] = useState<MemberFilterData>(filters);
  const [open, setOpen] = useState<boolean>(false);

  const handleApply = () => {
    const appliedFilters: MemberFilterData = {
      rank: localFilters.rank,
      member_program: localFilters.member_program,
      sort: localFilters.sort || "default",
      //id: localFilters.id || "desc",
      teaches_grad_school: localFilters.teaches_grad_school,
    };
    ;

    setFilters(appliedFilters);
    onFilter(appliedFilters);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalFilters(filters);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-4 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200">
        <h2 className="text-lg font-semibold">Member Filters</h2>

        {/* RANK */}
        <div className="space-y-1">
          <label className="text-sm font-small">Rank</label>
          <Select
            value={localFilters.rank || "any"}
            onValueChange={(val) =>
              setLocalFilters({ ...localFilters, rank: val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
              <SelectItem value="Instructor">Instructor</SelectItem>
              <SelectItem value="Technical Staff">Technical Staff</SelectItem>
              <SelectItem value="Administrative Aide">Administrative Aide</SelectItem>
              <SelectItem value="Technician">Technician</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Alumnus">Alumnus</SelectItem>
              <SelectItem value="Alumna">Alumna</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PROGRAM */}
        <div className="space-y-1">
          <label className="text-sm font-small">Program</label>
          <Select
            value={localFilters.member_program || "any"}
            onValueChange={(val) =>
              setLocalFilters({ ...localFilters, member_program: val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All</SelectItem>
              <SelectItem value="BSIT">BSIT</SelectItem>
              <SelectItem value="BLIS">BLIS</SelectItem>
              <SelectItem value="BSCS">BSCS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* SORT */}
        <div className="space-y-1">
          <label className="text-sm font-small">Sort by Name</label>
          <Select
            value={localFilters.sort || "default"}
            onValueChange={(val) =>
              setLocalFilters({ ...localFilters, sort: val as "default" | "asc" | "desc" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="asc">A → Z</SelectItem>
              <SelectItem value="desc">Z → A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* GRADUATE SCHOOL TEACHER */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={localFilters.teaches_grad_school === "1"}
            onCheckedChange={(checked: boolean | "indeterminate") =>
              setLocalFilters({
                ...localFilters,
                teaches_grad_school: checked === true ? "1" : undefined,
              })
            }
          />
          <label className="text-sm font-medium">Graduate School Teacher</label>
        </div>

        <Separator />

        {/* BUTTONS */}
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

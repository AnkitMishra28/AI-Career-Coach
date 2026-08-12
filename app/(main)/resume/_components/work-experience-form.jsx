"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { workExperienceSchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2, Briefcase, Pencil } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  } catch {
    return dateString;
  }
};

export function WorkExperienceForm({ entries = [], onChange }) {
  // All hooks declared at top
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Work experience description improved!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };
    onChange([...entries, formattedEntry]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const item = entries[index];
    setValue("jobTitle", item.jobTitle || item.title || "");
    setValue("company", item.company || item.organization || "");
    setValue("location", item.location || "");
    setValue("startDate", item.startDate || "");
    setValue("endDate", item.endDate || "");
    setValue("current", item.current || false);
    setValue("description", item.description || "");
    onChange(entries.filter((_, i) => i !== index));
    setIsAdding(true);
  };

  const handleImprove = async () => {
    const description = watch("description");
    const jobTitle = watch("jobTitle");
    const company = watch("company");

    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: "experience",
      contextDetails: { jobTitle, company },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-indigo-400" /> Work Experience
        </h3>
      </div>

      <div className="space-y-3">
        {entries.map((item, index) => (
          <Card key={index} className="glass-card border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  {item.jobTitle || item.title} @ {item.company || item.organization}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {item.location ? `${item.location} • ` : ""}
                  {item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(index)} className="h-8 w-8 text-muted-foreground hover:text-indigo-400">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(index)} className="h-8 w-8 text-muted-foreground hover:text-rose-400">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-300 whitespace-pre-wrap">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card className="glass-card border border-indigo-500/30">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-indigo-400">Add Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Job Title</label>
                <Input placeholder="e.g. Senior Full Stack Engineer" {...register("jobTitle")} />
                {errors.jobTitle && <p className="text-xs text-rose-400">{errors.jobTitle.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Company / Employer</label>
                <Input placeholder="e.g. Stripe" {...register("company")} />
                {errors.company && <p className="text-xs text-rose-400">{errors.company.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Location (Optional)</label>
                <Input placeholder="e.g. San Francisco, CA or Remote" {...register("location")} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Start Date</label>
                <Input type="month" {...register("startDate")} />
                {errors.startDate && <p className="text-xs text-rose-400">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">End Date</label>
                <Input type="month" {...register("endDate")} disabled={current} />
                {errors.endDate && <p className="text-xs text-rose-400">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current-exp"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) setValue("endDate", "");
                }}
                className="rounded border-white/20"
              />
              <label htmlFor="current-exp" className="text-xs text-muted-foreground cursor-pointer">
                I currently work here
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Responsibilities & Key Achievements</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImprove}
                  disabled={isImproving}
                  className="h-7 text-xs rounded-full border-indigo-500/30 text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20"
                >
                  {isImproving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1 text-indigo-400" />}
                  Improve with AI
                </Button>
              </div>
              <Textarea
                placeholder="Bullet points describing your responsibilities, technical ownership, and quantified achievements..."
                className="h-32 text-xs"
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-rose-400">{errors.description.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => { reset(); setIsAdding(false); }}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full">
              <PlusCircle className="h-4 w-4 mr-1.5" /> Add Experience
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)} className="w-full rounded-xl border-dashed border-white/20 hover:border-indigo-500/40 text-xs">
          <PlusCircle className="h-4 w-4 mr-1.5 text-indigo-400" /> Add Work Experience Entry
        </Button>
      )}
    </div>
  );
}

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
import { educationSchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2, GraduationCap, Pencil } from "lucide-react";
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

export function EducationForm({ entries = [], onChange }) {
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
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      fieldOfStudy: "",
      institution: "",
      startDate: "",
      endDate: "",
      grade: "",
      coursework: "",
      activities: "",
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
      toast.success("Academic summary improved!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve education details");
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
    setValue("degree", item.degree || item.title || "");
    setValue("fieldOfStudy", item.fieldOfStudy || "");
    setValue("institution", item.institution || item.organization || "");
    setValue("startDate", item.startDate || "");
    setValue("endDate", item.endDate || "");
    setValue("grade", item.grade || "");
    setValue("coursework", item.coursework || "");
    setValue("activities", item.activities || "");
    setValue("description", item.description || "");
    setValue("current", item.current || false);
    onChange(entries.filter((_, i) => i !== index));
    setIsAdding(true);
  };

  const handleImprove = async () => {
    const degree = watch("degree");
    const fieldOfStudy = watch("fieldOfStudy");
    const institution = watch("institution");
    const coursework = watch("coursework");
    const description = watch("description") || `${degree} in ${fieldOfStudy} at ${institution}. Coursework: ${coursework}`;

    await improveWithAIFn({
      current: description,
      type: "education",
      contextDetails: { degree, fieldOfStudy, institution, coursework },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-cyan-400" /> Education & Academic Profile
        </h3>
      </div>

      <div className="space-y-3">
        {entries.map((item, index) => (
          <Card key={index} className="glass-card border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  {item.degree || item.title} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ""} - {item.institution || item.organization}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {item.grade ? `Grade / CGPA: ${item.grade} • ` : ""}
                  {item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(index)} className="h-8 w-8 text-muted-foreground hover:text-cyan-400">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(index)} className="h-8 w-8 text-muted-foreground hover:text-rose-400">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-gray-300">
              {item.coursework && <p><span className="font-semibold text-cyan-400">Relevant Coursework:</span> {item.coursework}</p>}
              {item.activities && <p><span className="font-semibold text-cyan-400">Activities / Societies:</span> {item.activities}</p>}
              {item.description && <p className="mt-2 whitespace-pre-wrap">{item.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card className="glass-card border border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-cyan-400">Add Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Degree / Qualification</label>
                <Input placeholder="e.g. Bachelor of Technology (B.Tech)" {...register("degree")} />
                {errors.degree && <p className="text-xs text-rose-400">{errors.degree.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Field of Study / Specialization</label>
                <Input placeholder="e.g. Computer Science & Engineering" {...register("fieldOfStudy")} />
                {errors.fieldOfStudy && <p className="text-xs text-rose-400">{errors.fieldOfStudy.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Institution / College / University</label>
                <Input placeholder="e.g. IIT Bombay / Delhi University" {...register("institution")} />
                {errors.institution && <p className="text-xs text-rose-400">{errors.institution.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Grade / CGPA / Percentage (Optional)</label>
                <Input placeholder="e.g. 8.9 / 10.0 or 85%" {...register("grade")} />
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
                id="current-edu"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) setValue("endDate", "");
                }}
                className="rounded border-white/20"
              />
              <label htmlFor="current-edu" className="text-xs text-muted-foreground cursor-pointer">
                I am currently studying here
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Relevant Coursework (Optional)</label>
                <Input placeholder="e.g. Data Structures, OS, Database Systems, Computer Networks" {...register("coursework")} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Activities / Societies / Honors (Optional)</label>
                <Input placeholder="e.g. ACM Student Chapter Lead, Hackathon Winner" {...register("activities")} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Academic Summary & Achievements (Optional)</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImprove}
                  disabled={isImproving}
                  className="h-7 text-xs rounded-full border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20"
                >
                  {isImproving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1 text-cyan-400" />}
                  Improve with AI
                </Button>
              </div>
              <Textarea
                placeholder="Academic summary, capstone topics, honors, thesis, or specialized learning highlights..."
                className="h-28 text-xs"
                {...register("description")}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => { reset(); setIsAdding(false); }}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleAdd} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full">
              <PlusCircle className="h-4 w-4 mr-1.5" /> Add Education
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)} className="w-full rounded-xl border-dashed border-white/20 hover:border-cyan-500/40 text-xs">
          <PlusCircle className="h-4 w-4 mr-1.5 text-cyan-400" /> Add Education Entry
        </Button>
      )}
    </div>
  );
}

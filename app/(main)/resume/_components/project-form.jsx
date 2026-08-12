"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { projectSchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2, Code2, ExternalLink, Github, Pencil } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

export function ProjectForm({ entries = [], onChange }) {
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
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      description: "",
      technologies: "",
      role: "",
      achievements: "",
      projectUrl: "",
      githubUrl: "",
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
      toast.success("Project description improved!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve project details");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleAdd = handleValidation((data) => {
    onChange([...entries, data]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const item = entries[index];
    setValue("projectName", item.projectName || item.title || "");
    setValue("description", item.description || "");
    setValue("technologies", item.technologies || "");
    setValue("role", item.role || "");
    setValue("achievements", item.achievements || "");
    setValue("projectUrl", item.projectUrl || "");
    setValue("githubUrl", item.githubUrl || "");
    onChange(entries.filter((_, i) => i !== index));
    setIsAdding(true);
  };

  const handleImprove = async () => {
    const projectName = watch("projectName");
    const technologies = watch("technologies");
    const description = watch("description");

    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: "project",
      contextDetails: { projectName, technologies },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Code2 className="h-4 w-4 text-purple-400" /> Technical Projects
        </h3>
      </div>

      <div className="space-y-3">
        {entries.map((item, index) => (
          <Card key={index} className="glass-card border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  {item.projectName || item.title}
                  {item.technologies && (
                    <span className="text-xs font-mono font-normal text-purple-400">
                      ({item.technologies})
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  {item.projectUrl && (
                    <a href={item.projectUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline">
                      <ExternalLink className="h-3 w-3" /> Live Demo
                    </a>
                  )}
                  {item.githubUrl && (
                    <a href={item.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-gray-300 hover:underline">
                      <Github className="h-3 w-3" /> Repository
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(index)} className="h-8 w-8 text-muted-foreground hover:text-purple-400">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(index)} className="h-8 w-8 text-muted-foreground hover:text-rose-400">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-gray-300">
              <p className="whitespace-pre-wrap">{item.description}</p>
              {item.role && <p className="mt-1"><span className="font-semibold text-purple-400">Role / Contribution:</span> {item.role}</p>}
              {item.achievements && <p><span className="font-semibold text-purple-400">Key Outcomes:</span> {item.achievements}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card className="glass-card border border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-purple-400">Add Technical Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Project Name</label>
                <Input placeholder="e.g. Distributed Task Queue Engine" {...register("projectName")} />
                {errors.projectName && <p className="text-xs text-rose-400">{errors.projectName.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Technologies / Skills Used</label>
                <Input placeholder="e.g. React, Node.js, Redis, Docker, PostgreSQL" {...register("technologies")} />
                {errors.technologies && <p className="text-xs text-rose-400">{errors.technologies.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Live Project URL (Optional)</label>
                <Input placeholder="https://myproject.com" {...register("projectUrl")} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">GitHub / Code Repository URL (Optional)</label>
                <Input placeholder="https://github.com/username/repo" {...register("githubUrl")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Your Role / Contribution (Optional)</label>
                <Input placeholder="e.g. Solo Developer / Lead Backend Architect" {...register("role")} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Measurable Outcomes / Results (Optional)</label>
                <Input placeholder="e.g. Handled 5,000 requests/sec with < 50ms latency" {...register("achievements")} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Project Overview & Implementation Details</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImprove}
                  disabled={isImproving}
                  className="h-7 text-xs rounded-full border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20"
                >
                  {isImproving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1 text-purple-400" />}
                  Improve with AI
                </Button>
              </div>
              <Textarea
                placeholder="Problem solved, architecture choices, technical implementation details, and key results..."
                className="h-28 text-xs"
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-rose-400">{errors.description.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => { reset(); setIsAdding(false); }}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleAdd} className="bg-purple-600 hover:bg-purple-500 text-white rounded-full">
              <PlusCircle className="h-4 w-4 mr-1.5" /> Add Project
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)} className="w-full rounded-xl border-dashed border-white/20 hover:border-purple-500/40 text-xs">
          <PlusCircle className="h-4 w-4 mr-1.5 text-purple-400" /> Add Technical Project Entry
        </Button>
      )}
    </div>
  );
}

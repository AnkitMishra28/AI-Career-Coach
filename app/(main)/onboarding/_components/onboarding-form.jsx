"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser } from "@/actions/user";

const OnboardingForm = ({ industries }) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      experience: 0,
    },
  });

  // All hooks declared at top of component body
  useEffect(() => {
    if (updateResult?.error) {
      toast.error(updateResult.error);
    }
  }, [updateResult]);

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      let skills = values.skills;
      if (typeof skills === "string") {
        skills = skills.split(",").map((skill) => skill.trim()).filter(Boolean);
      }
      if (!Array.isArray(skills) || skills.length === 0) {
        toast.error("Please enter at least one skill");
        return;
      }

      const result = await updateUserFn({
        ...values,
        experience: typeof values.experience === "number" ? values.experience : Number(values.experience),
        industry: formattedIndustry,
        skills: skills,
      });

      if (!result || typeof result.success === "undefined") {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (!result.success) {
        toast.error(result.error || "Failed to complete profile. Please try again.");
        return;
      }

      toast.success("Profile completed successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "Failed to complete profile. Please try again.");
    }
  };

  const watchIndustry = watch("industry");
  const watchSkills = watch("skills");
  const watchBio = watch("bio");
  const watchExperience = watch("experience");
  const isSubmitDisabled = 
    updateLoading || 
    !watchIndustry || 
    !selectedIndustry || 
    !watchSkills || 
    !watchBio || 
    watchExperience === undefined ||
    watchExperience === null ||
    watchExperience === "" ||
    isNaN(Number(watchExperience));

  return (
    <div className="flex items-center justify-center bg-background min-h-screen py-10 px-4">
      <Card className="w-full max-w-lg glass-card border border-indigo-500/20 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-extrabold tracking-tight text-foreground">
            Complete Your Professional Profile
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Select your industry specialization and skills to tailor AI resume suggestions and mock interviews.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                Industry Sector
              </Label>
              <Select
                onValueChange={(value) => {
                  const ind = industries.find((i) => i.id === value);
                  setSelectedIndustry(ind);
                  setValue("industry", value);
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry" className="bg-white/[0.02]">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1117] border-white/15">
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-xs text-rose-400 font-medium">{errors.industry.message}</p>
              )}
            </div>

            {selectedIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry" className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                  Specialization / Domain
                </Label>
                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry" className="bg-white/[0.02]">
                    <SelectValue placeholder="Select a specialization" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1117] border-white/15">
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-xs text-rose-400 font-medium">{errors.subIndustry.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                Years of Professional Experience
              </Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="e.g. 5"
                className="bg-white/[0.02]"
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && (
                <p className="text-xs text-rose-400 font-medium">{errors.experience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                Key Technical & Professional Skills
              </Label>
              <Input
                id="skills"
                placeholder="e.g. React, Next.js, Node.js, PostgreSQL, Docker, System Design"
                className="bg-white/[0.02]"
                {...register("skills")}
              />
              <p className="text-[11px] text-muted-foreground">Separate skills with commas</p>
              {errors.skills && (
                <p className="text-xs text-rose-400 font-medium">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                Professional Bio / Career Focus
              </Label>
              <Textarea
                id="bio"
                placeholder="Briefly describe your career background and what you are looking to achieve..."
                className="h-28 text-xs bg-white/[0.02]"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-xs text-rose-400 font-medium">{errors.bio.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-5 shadow-lg shadow-indigo-600/25"
            >
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Onboarding & Enter Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;

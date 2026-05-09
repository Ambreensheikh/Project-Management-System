"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatisticsCard } from "@/components/dashboard/StatisticsCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";

interface Project {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  status: "To Do" | "In Progress" | "Done";
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data.data); // Assuming the API returns { success: true, data: [...] }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalProjects = projects.length;
  const pendingTasks = projects.filter(
    (p) => p.status === "To Do" || p.status === "In Progress"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "Done"
  ).length;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl text-gray-50">
              Dashboard
            </h1>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Project
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatisticsCard
              title="Total Projects"
              value={totalProjects}
              description="All projects in your workspace"
            />
            <StatisticsCard
              title="Pending Projects"
              value={pendingTasks}
              description="Projects not yet completed"
            />
            <StatisticsCard
              title="Completed Projects"
              value={completedProjects}
              description="Projects successfully finished"
            />
          </div>

          {loading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[120px]" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-4 text-red-500">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div
              className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
              x-chunk="dashboard-02-chunk-1"
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight text-gray-50">
                  You have no projects
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start by adding a new project to your workspace.
                </p>
                <Button className="mt-4 flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Project
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  title={project.title}
                  description={project.description}
                  date={new Date(project.createdAt).toLocaleDateString()}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
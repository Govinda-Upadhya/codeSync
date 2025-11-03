import Dashnav from "../../components/dashnav";
import { Plus, FolderCode, Users, ShieldPlus } from "lucide-react";
import Functioncard from "../../components/functioncard";
import ProjectsCard from "../../components/projectsCard";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { prismaClient } from "@repo/db/client";
import CollabProject from "../../components/collabProject";
export default async function Page() {
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: { username: session!.user!.name! },
  });
  const actions = [
    {
      icon: Plus,
      title: "New Project",
      description: "Start coding something amazing",
      variant: "gradient", // optional (for styling if needed)
      navigate: "/editor/new",
    },
    {
      icon: Users,
      title: "Join Session",
      description: "Join with your team",
      navigate: "/joinSession",
    },
    {
      icon: ShieldPlus,
      title: "Create Session",
      description: "Collaborate with your team",
      navigate: "/dashboard/roomName",
    },
  ];
  const projects = await prismaClient.fileSave.findMany({
    where: {
      ownerId: user!.id,
    },
  });
  const owned_projects = await prismaClient.collab.findMany({
    where: { ownerId: user!.id },
    include: { collaborators: true },
  });
  const contributor = await prismaClient.collab.findMany({
    where: {
      collaborators: {
        some: {
          id: user!.id,
        },
      },
    },
    include: { collaborators: true },
  });

  console.log("hello", [...contributor, ...owned_projects]);
  return (
    <div className="flex flex-col sm:h-screen sm:w-screen md:w-min-[100vw] md:h-min-[100vh] items-center bg-navbarbackground-500 text-white">
      <Dashnav profile={session?.user?.image} />
      <div className="flex flex-col w-[80%] p-4">
        <div className="flex text-4xl mt-2 mb-2">
          Welcome, {session?.user?.name}
        </div>
        <div className="flex text-gray-400 mb-2">
          Continue where you left off or start something new
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {actions.map((action, key) => (
            <Functioncard
              key={key}
              icon={<action.icon />}
              title={action.title}
              description={action.description}
              navigate={action.navigate}
            />
          ))}
        </div>
        <div className="flex flex-col h-full">
          <div className="flex gap-4 mb-3 text-4xl">Recent Projects</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {projects.map((project, key) => (
              <ProjectsCard
                key={project.id}
                id={project.id}
                title={project.name}
                timeAgo={project.updated_at}
                language={project.language}
                members={project.dev_count}
              />
            ))}
          </div>
          <div className="flex gap-4 mb-3 text-4xl mt-3 ">Collabs Owned</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-10">
            {owned_projects.map((project, key) => (
              <CollabProject
                contributor={false}
                key={project.id}
                roomName={project.roomName}
                id={project.id}
                title={project.fileName}
                timeAgo={project.updated_at}
                language={project.language}
                members={4}
              />
            ))}
          </div>
          <div className="flex gap-4 mb-3 text-4xl mt-3 ">
            Collabs Contributor
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-10">
            {contributor.map((project, key) => (
              <CollabProject
                contributor={true}
                key={project.id}
                roomName={project.roomName}
                id={project.id}
                title={project.fileName}
                timeAgo={project.updated_at}
                language={project.language}
                members={4}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Badge } from "@components/ui/badge";
import { useRouter } from "next/router";
import { Organization } from "@portaljs/ckan";
import { api } from "@utils/api";
import { User, Calendar, Database } from 'lucide-react';


export interface DashboardOrganizationCardProps {
  id: string,
  name: string
}

export default ({
  id,
  name,
}: DashboardOrganizationCardProps) => {
  const {data: organization} = api.organization.get.useQuery({
    name: name,
    includeUsers: true
  })
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/dashboard/organizations/${name}/edit`)}
      className="grid cursor-pointer p-8 bg-white-500 shadow-lg hover:bg-slate-100 hover:shadow-2xl transition duration-300"
    >
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">{organization?.title}</h2>
        </div>
        <div className="min-w-[400px] max-w-[600px] py-4">
          {organization?.description ? (
            <p className="truncate">{organization?.description}</p>
          ):(
            <p>No description provided.</p>
          )}
        </div>
        <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center">
          {organization?.state === "active" && (
            <>
            <span className="flex items-center gap-1">
              <Badge variant={"success"} className="text-[#03543F]">
                Active
              </Badge>
            </span>
            <span className="hidden xl:block">•</span>
            </>
          )}
          {organization?.created && (
            <span className="flex items-center gap-1">
              <Calendar size={14}/>
              Created On {new Date(organization?.created).toLocaleDateString("en-GB").replace(/\//g, '.')}
            </span>
          )}
          <span className="hidden xl:block">•</span>
          <span className="flex items-center gap-1">
            <Database size={14} color="purple"/>
            {organization?.package_count} {(organization?.package_count||0)>1 ? "Datasets" : "Dataset"} 
          </span>
          <span className="hidden xl:block">•</span>
          <span className="flex items-center gap-1">
            <User size={14}/>{organization?.users?.length} {(organization?.users?.length||0)>1 ? "Members" : "Member"}</span>
        </div>
      </div>
    </div>
  );
};

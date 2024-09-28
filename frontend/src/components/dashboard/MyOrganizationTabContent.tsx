import DatasetsFilter from "@components/_shared/DatasetsFilter";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import DashboardDatasetCard, {
  DashboardDatasetCardProps,
} from "@components/_shared/DashboardDatasetCardOld";
import { useState } from "react";
import { DocumentReportIcon, EyeOffIcon, GlobeAltIcon } from "@lib/icons";
import { useSession } from "next-auth/react";
import { api } from "@utils/api";
import UserAvatar from "@components/_shared/UserAvatar";
import { User } from "@interfaces/ckan/user.interface";
import { Value } from "@radix-ui/react-select";

export default () => {
  const datasets: DashboardDatasetCardProps[] = [
    {
      variant: "success",
      keywords: ["Vehicle registration"],
      title: "Asia Transport Outlook",
      contributors: usersMock.map((x) => ({ imageUrl: x.icon })),
      dateState: "Updated on 23.03.2023",
      region: "Asia",
      updateFrequency: "Updated annually",
      href: "",
      visibility: "public",
    },
    {
      variant: "purple",
      keywords: ["Urban mobility", "Mobility Analytics"],
      title: "Transport performance indicators",
      contributors: usersMock.map((x) => ({ imageUrl: x.icon })),
      dateState: "Added on 28.02.2023",
      region: "Asia",
      href: "",
      visibility: "private",
    },
    {
      variant: "purple",
      keywords: ["Urban mobility", "Parking"],
      title: "Parking Availability in Vietnam",
      contributors: usersMock.map((x) => ({ imageUrl: x.icon })).slice(1),
      dateState: "Added on 28.02.2023",
      region: "National",
      href: "",
      visibility: "private",
    },
    {
      variant: "purple",
      keywords: ["Urban mobility", "Public Transit"],
      title: "Public Transit Ridership in South East Asia",
      contributors: usersMock.map((x) => ({ imageUrl: x.icon })).slice(1),
      dateState: "Added on 28.02.2023",
      region: "Asia",
      href: "",
      visibility: "private",
    },
    {
      variant: "purple",
      keywords: ["Urban mobility"],
      title: "Origin-Destination (O-D) Data For 5 major cities in Malaysia",
      contributors: usersMock.map((x) => ({ imageUrl: x.icon })).slice(1),
      dateState: "Added on 28.02.2023",
      region: "National",
      href: "",
      visibility: "private",
    },
  ];

  const [visibility, setVisibility] = useState("All");
  const [contributor, setContributor] = useState("All");
  const { data } = api.organization.listForUser.useQuery();

  const org = data ? data[0] : null;

  const { data: orgData, isLoading } = api.organization.get.useQuery({
    name: org?.name ?? "",
    includeUsers: true,
  });

  const contributors = orgData?.users?.map((user) => ({
    icon: <UserAvatar user={user as User} />,
    value: user.display_name as string,
    isSelected: false,
  }));

  return (
    <div className=" flex flex-col justify-between gap-4 sm:flex-row sm:gap-8">
      <div className="order-1 space-y-12 lg:min-w-[150px]">
        <SelectableItemsList
          items={[
            {
              icon: <DocumentReportIcon />,
              isSelected: true,
              value: "All",
            },
            {
              icon: <GlobeAltIcon />,
              isSelected: false,
              value: "Public",
            },
            {
              icon: <EyeOffIcon />,
              isSelected: false,
              value: "Drafts",
            },
          ]}
          onSelectedItem={(option) => setVisibility(option)}
          selected={visibility}
          title="Categories"
        />
        <SelectableItemsList
          items={[
            {
              isSelected: true,
              value: "All",
              icon: <DocumentReportIcon />,
            },
            ...(contributors ?? []),
          ]}
          onSelectedItem={(v) => setContributor(v)}
          title="Contributors"
        />
        <div className="space-y-2.5 lg:hidden">
          <DatasetsFilter />
        </div>
      </div>
      <div className="order-3 w-fit">
        <h3 className="mb-4 text-sm font-semibold">Timeline</h3>
        <section className="flex flex-col gap-4">
          {datasets.map((x) => (
            <DashboardDatasetCard {...x} />
          ))}
        </section>
      </div>
      <div className="order-2 hidden space-y-2.5 border-b-[1px] pt-3 sm:order-3 sm:w-[340px] sm:max-w-[340px] sm:border-b-0 sm:border-l-[1px] sm:pl-3 lg:block">
        <DatasetsFilter />
      </div>
    </div>
  );
};

export const usersMock = [
  {
    icon: "https://s3-alpha-sig.figma.com/img/9afa/40e6/7f9adfb6486c67063d80474f4d89a506?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NEi3xXQhPKkFkLrImrAMoXZdLYuHPxcIEVM~uy4L1ysR-peh3aZL~CHzB5XIoq1eBqsJEgZaU-1sYXP1i99uFBwWQGtCPOvVzMr~Ynh8H3D-nMrTRBuRS7Bz8CQ5015Ql7YZZuMnXiluKM~Gi532dtgKfeZCmNLciv69G2O8xnL1u2C8tUJRJNbHLjdlntMIgBAj4JJKZr3UioutWGZ9sBCtzlR-FQkG4SnxMeOXUJfd7A~Dsvgk0QZNuqZItHfuBFDTKo1v99mKPPlADkvpwXt2bvulHiSTHipxahhF0TWHe9kgC8GKNDEwtgisipRjr1C5p2u59y0jdtW0vV3iDw__",
    name: "Jese Leos",
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/07f2/4b43/13a3636719731254b20a53f142074129?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TE5jDENP4U8EAEIESaaubv~q3zRxeqLDrVDHOjqKzdVVmdqGJAPEgGuw1ZfobH7iyf52ZLcCCrWT~67~k2Yc2PqT1mFj9gWxFHBvEn2-QBXa0KypJ4IavzPIreRs8CPo5780-CbllE5vb5X-k7ndLMYA0AytYDUULEReF4uRPXx5kQxCF-O85wQ31nMs4tdEgphXBAdtf08QNmEokXcSt0nakX5c3xqR2t~vtkEAJbZh8jHaRp7y20P7IM-HILQZvcQpoM6JJUIwSNNA~yPnSaecSQrXIiaQMFw6jqVdlbW7GPp74uGounxm53UYafXcBamTtUr5UTOEix4wHINZog__",

    name: "Bonnie Green",
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/0fd7/5a97/c4192415d6c6bfda98f5332561767c52?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WxgHyHmqC3nZLGqRG-bC7kfj~Qr~Eb95tGLkvYd2DSD4CqiSRG7sk8MNv0LY-9-JS6a-Y9To8e-WYL5lwATZReIZZaKat-6NrGBfaBfIPle3CZmOgDkdDWyQI1oqrW-FZ5ErVdGl9ZQbHMR9SYDKojx2SUQyDSSrZFBaRROb4XhBcGMZP-dSXaZSMhxrYKuorwsU14imu1s9Mkv749aiCNLHLWq8nN684W-nx365PJf4nPIke9ccbAZjq~ACodzmzMo5NhlL2qjE56yo8uM7kRer--wzWyYepv~W7DCFFAxEMDZhdn2LCeeO-XIX-UJGBwVKaUMLQyROI~HCTZLI0A__",
    name: "Michael Gough",
  },
  {
    icon: "https://s3-alpha-sig.figma.com/img/a756/1ca3/84cac555f78cac29f997f8adf8d31e17?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I-Ruzxy-~Lj4lMeve22jKNbZGxnpKVKnAbuoSdly4HuLbVv72rD5F4ErIlpCZFoKd4IaNj5ybw8qplKoJF24A6ROQxta-OlMxIdgQCQ0PX9oNgKcftOmIPSaT9t3GqxTF7NuY7B82xrKcFM6FfUpRr93TpREMnsrhIRz17vg6-L8a2Zp4CJDC7LuAswpmTvBbSze-q2AzPQDYJoF44iXAncy~6oSwCq8lZGb2E24hTFKVd2rZ4Fenrujob9ZKVEYJTJUGuNRyixAXgfbAdKfzYvdtZ8Fz-7SuftnlFcVCsn8l5mCexGZrcS8EJ-Jhz5hxRHCxoz-vQvAY6xKmU86uw__",
    name: "Helene Engels",
  },
];

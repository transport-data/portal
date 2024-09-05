import DatasetsFilter from "@components/_shared/DatasetsFilter";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import DashboardDatasetCard, {
  DashboardDatasetCardProps,
} from "src/components/_shared/DasboardDatasetCard";

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

  return (
    <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:gap-8">
      <div className="order-1 space-y-12 sm:w-[152px]">
        <SelectableItemsList
          items={[
            {
              icon: (
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="currentColor"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.4361 5.05346L10.4361 5.05351C10.6049 5.22223 10.6997 5.45107 10.6998 5.6897C10.6998 5.68974 10.6998 5.68977 10.6998 5.68981V11.6999C10.6998 11.9386 10.605 12.1675 10.4362 12.3363C10.2674 12.5051 10.0385 12.5999 9.7998 12.5999H4.1998C3.96111 12.5999 3.73219 12.5051 3.56341 12.3363C3.39463 12.1675 3.2998 11.9386 3.2998 11.6999V3.2999C3.2998 3.06121 3.39463 2.83229 3.56341 2.66351C3.73219 2.49472 3.96111 2.3999 4.1998 2.3999H7.4099C7.40993 2.3999 7.40997 2.3999 7.41001 2.3999C7.64864 2.39998 7.87748 2.49483 8.0462 2.6636L8.04625 2.66366L10.4361 5.05346ZM5.7998 8.10617C5.78327 8.08743 5.76611 8.06915 5.74833 8.05137C5.52329 7.82633 5.21806 7.6999 4.8998 7.6999C4.58154 7.6999 4.27632 7.82633 4.05128 8.05137C3.82623 8.27642 3.6998 8.58164 3.6998 8.8999V10.9999C3.6998 11.3182 3.82623 11.6234 4.05128 11.8484C4.27632 12.0735 4.58154 12.1999 4.8998 12.1999C5.21807 12.1999 5.52329 12.0735 5.74833 11.8484C5.82839 11.7684 5.89596 11.6782 5.94981 11.5808C6.00365 11.6782 6.07122 11.7684 6.15128 11.8484C6.37632 12.0735 6.68154 12.1999 6.9998 12.1999C7.31807 12.1999 7.62329 12.0735 7.84833 11.8484C7.92839 11.7684 7.99596 11.6782 8.04981 11.5808C8.10365 11.6782 8.17122 11.7684 8.25128 11.8484L8.60483 11.4949L8.25128 11.8484C8.47632 12.0735 8.78154 12.1999 9.0998 12.1999C9.41807 12.1999 9.72329 12.0735 9.94833 11.8484C10.1734 11.6234 10.2998 11.3182 10.2998 10.9999V6.0999C10.2998 5.78164 10.1734 5.47642 9.94833 5.25137C9.72329 5.02633 9.41806 4.8999 9.0998 4.8999C8.78154 4.8999 8.47632 5.02633 8.25128 5.25137C8.02623 5.47642 7.8998 5.78164 7.8998 6.0999V6.70617C7.88327 6.68743 7.86611 6.66915 7.84833 6.65138C7.62329 6.42633 7.31806 6.2999 6.9998 6.2999C6.68155 6.2999 6.37632 6.42633 6.15128 6.65137C5.92623 6.87642 5.7998 7.18164 5.7998 7.4999V8.10617Z" />
                </svg>
              ),
              isSelected: true,
              value: "All",
            },
            {
              icon: (
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.25 7.5C12.25 8.89239 11.6969 10.2277 10.7123 11.2123C9.72774 12.1969 8.39239 12.75 7 12.75M12.25 7.5C12.25 6.10761 11.6969 4.77226 10.7123 3.78769C9.72774 2.80312 8.39239 2.25 7 2.25M12.25 7.5H1.75M7 12.75C5.60761 12.75 4.27226 12.1969 3.28769 11.2123C2.30312 10.2277 1.75 8.89239 1.75 7.5M7 12.75C7.96658 12.75 8.75 10.3992 8.75 7.5C8.75 4.60083 7.96658 2.25 7 2.25M7 12.75C6.03342 12.75 5.25 10.3992 5.25 7.5C5.25 4.60083 6.03342 2.25 7 2.25M7 2.25C5.60761 2.25 4.27226 2.80312 3.28769 3.78769C2.30312 4.77226 1.75 6.10761 1.75 7.5"
                    stroke-width="1.5"
                  />
                </svg>
              ),
              isSelected: false,
              value: "Public",
            },
            {
              icon: (
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="currentColor"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.24715 2.46483L2.26414 2.48124L3.48755 3.70534L3.74374 3.96168L4.06707 3.79796C4.97581 3.33782 5.98033 3.09871 6.99892 3.10009H6.9996C9.85408 3.10009 12.2796 4.94019 13.1528 7.49986C12.7515 8.67321 12.023 9.70869 11.0517 10.4831L10.6142 10.832L11.0098 11.2276L12.0369 12.2547C12.0721 12.2922 12.0914 12.3418 12.091 12.3932C12.0905 12.4457 12.0695 12.4958 12.0324 12.5329C11.9953 12.57 11.9452 12.591 11.8927 12.5915C11.8413 12.5919 11.7917 12.5726 11.7543 12.5374L5.14215 5.92533L5.49799 5.71527L6.28333 6.50113L6.48694 6.70487L6.76533 6.63094C6.91805 6.59038 7.07874 6.59065 7.23132 6.63172C7.3839 6.67279 7.52302 6.75321 7.63475 6.86494C7.74648 6.97667 7.82691 7.11579 7.86797 7.26837C7.90904 7.42095 7.90931 7.58164 7.86875 7.73436L7.79485 8.01264L7.99845 8.21624L9.05825 9.27604L9.51443 9.73222L9.84238 9.17666C10.2144 8.54638 10.3664 7.81029 10.2744 7.0842C10.1824 6.3581 9.85157 5.6832 9.33403 5.16566C8.81649 4.64813 8.14159 4.31733 7.41549 4.2253C6.82066 4.14991 6.21912 4.23828 5.67454 4.47725L5.0772 3.87952V5.08719V5.08789V5.86038L1.96226 2.74544C1.92715 2.70797 1.90776 2.65838 1.90821 2.60695C1.90867 2.55451 1.9297 2.50435 1.96678 2.46727C2.00386 2.43019 2.05403 2.40915 2.10647 2.4087C2.1589 2.40824 2.20943 2.4284 2.24715 2.46483Z" />
                  <path d="M8.71751 12.1878L6.82471 10.2943C6.14409 10.2517 5.50243 9.96208 5.02015 9.47993C4.53787 8.99778 4.24813 8.3562 4.20531 7.67559L1.63421 5.10449C1.04286 5.8087 0.596357 6.62273 0.320312 7.49989C1.21211 10.3398 3.86581 12.3999 6.99971 12.3999C7.59261 12.3999 8.16801 12.3264 8.71751 12.1878Z" />
                </svg>
              ),
              isSelected: false,
              value: "Drafts",
            },
            {
              icon: (
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="currentColor"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.0462 2.6636L8.04625 2.66366L10.4361 5.05346L10.4361 5.05351C10.6049 5.22223 10.6997 5.45107 10.6998 5.6897C10.6998 5.68974 10.6998 5.68977 10.6998 5.68981V11.6999C10.6998 11.9386 10.605 12.1675 10.4362 12.3363C10.2674 12.5051 10.0385 12.5999 9.7998 12.5999H9.69821C10.1108 11.8642 10.321 11.0251 10.2971 10.1693C10.2635 8.96878 9.77155 7.82664 8.92231 6.9774C8.07306 6.12816 6.93093 5.63624 5.73039 5.60264C4.87464 5.57869 4.0355 5.7889 3.2998 6.2015V3.2999C3.2998 3.06121 3.39463 2.83229 3.56341 2.66351C3.73219 2.49472 3.96111 2.3999 4.1998 2.3999H7.4099C7.40993 2.3999 7.40997 2.3999 7.41001 2.3999C7.64864 2.39998 7.87748 2.49483 8.0462 2.6636Z" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.59975 7.5C5.10602 7.49993 4.62104 7.63041 4.194 7.87823C3.76696 8.12604 3.41304 8.48236 3.16812 8.91107C2.92321 9.33978 2.79601 9.82563 2.79942 10.3194C2.80283 10.8131 2.93673 11.2971 3.18755 11.7224L2.30485 12.6044C2.23981 12.6694 2.18821 12.7466 2.153 12.8315C2.11778 12.9164 2.09964 13.0075 2.09961 13.0994C2.09958 13.1913 2.11765 13.2824 2.15281 13.3674C2.18797 13.4523 2.23951 13.5295 2.3045 13.5945C2.36949 13.6596 2.44666 13.7112 2.53159 13.7464C2.61652 13.7816 2.70756 13.7998 2.7995 13.7998C2.89145 13.7998 2.9825 13.7817 3.06746 13.7466C3.15241 13.7114 3.22961 13.6599 3.29465 13.5949L4.17735 12.7122C4.54824 12.9308 4.96455 13.0609 5.39391 13.0925C5.82327 13.124 6.25412 13.0561 6.65298 12.8941C7.05184 12.732 7.40796 12.4802 7.69366 12.1581C7.97936 11.8361 8.18695 11.4525 8.30029 11.0372C8.41364 10.6218 8.42968 10.186 8.34718 9.76342C8.26467 9.34088 8.08585 8.94305 7.82459 8.60086C7.56334 8.25868 7.2267 7.98134 6.84083 7.79041C6.45497 7.59948 6.03027 7.5001 5.59975 7.5ZM4.19975 10.3C4.19975 9.9287 4.34725 9.5726 4.6098 9.31005C4.87235 9.0475 5.22845 8.9 5.59975 8.9C5.97105 8.9 6.32715 9.0475 6.5897 9.31005C6.85225 9.5726 6.99975 9.9287 6.99975 10.3C6.99975 10.6713 6.85225 11.0274 6.5897 11.2899C6.32715 11.5525 5.97105 11.7 5.59975 11.7C5.22845 11.7 4.87235 11.5525 4.6098 11.2899C4.34725 11.0274 4.19975 10.6713 4.19975 10.3Z"
                  />
                </svg>
              ),
              isSelected: false,
              value: "In Review",
            },
          ]}
          onSelectedItem={() => ""}
          title="Categories"
        />
        <SelectableItemsList
          items={[
            {
              isSelected: true,
              value: "All",
              icon: (
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="currentColor"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.4361 5.05346L10.4361 5.05351C10.6049 5.22223 10.6997 5.45107 10.6998 5.6897C10.6998 5.68974 10.6998 5.68977 10.6998 5.68981V11.6999C10.6998 11.9386 10.605 12.1675 10.4362 12.3363C10.2674 12.5051 10.0385 12.5999 9.7998 12.5999H4.1998C3.96111 12.5999 3.73219 12.5051 3.56341 12.3363C3.39463 12.1675 3.2998 11.9386 3.2998 11.6999V3.2999C3.2998 3.06121 3.39463 2.83229 3.56341 2.66351C3.73219 2.49472 3.96111 2.3999 4.1998 2.3999H7.4099C7.40993 2.3999 7.40997 2.3999 7.41001 2.3999C7.64864 2.39998 7.87748 2.49483 8.0462 2.6636L8.04625 2.66366L10.4361 5.05346ZM5.7998 8.10617C5.78327 8.08743 5.76611 8.06915 5.74833 8.05137C5.52329 7.82633 5.21806 7.6999 4.8998 7.6999C4.58154 7.6999 4.27632 7.82633 4.05128 8.05137C3.82623 8.27642 3.6998 8.58164 3.6998 8.8999V10.9999C3.6998 11.3182 3.82623 11.6234 4.05128 11.8484C4.27632 12.0735 4.58154 12.1999 4.8998 12.1999C5.21807 12.1999 5.52329 12.0735 5.74833 11.8484C5.82839 11.7684 5.89596 11.6782 5.94981 11.5808C6.00365 11.6782 6.07122 11.7684 6.15128 11.8484C6.37632 12.0735 6.68154 12.1999 6.9998 12.1999C7.31807 12.1999 7.62329 12.0735 7.84833 11.8484C7.92839 11.7684 7.99596 11.6782 8.04981 11.5808C8.10365 11.6782 8.17122 11.7684 8.25128 11.8484L8.60483 11.4949L8.25128 11.8484C8.47632 12.0735 8.78154 12.1999 9.0998 12.1999C9.41807 12.1999 9.72329 12.0735 9.94833 11.8484C10.1734 11.6234 10.2998 11.3182 10.2998 10.9999V6.0999C10.2998 5.78164 10.1734 5.47642 9.94833 5.25137C9.72329 5.02633 9.41806 4.8999 9.0998 4.8999C8.78154 4.8999 8.47632 5.02633 8.25128 5.25137C8.02623 5.47642 7.8998 5.78164 7.8998 6.0999V6.70617C7.88327 6.68743 7.86611 6.66915 7.84833 6.65138C7.62329 6.42633 7.31806 6.2999 6.9998 6.2999C6.68155 6.2999 6.37632 6.42633 6.15128 6.65137C5.92623 6.87642 5.7998 7.18164 5.7998 7.4999V8.10617Z" />
                </svg>
              ),
            },
            ...[
              ...usersMock
                .map((x) => ({
                  icon: (
                    <img
                      className="h-5 w-5 rounded-full border-2 border-white dark:border-gray-800"
                      src={x.icon}
                    />
                  ),
                  value: x.name,
                  isSelected: false,
                }))
                .slice(0, usersMock.length - 2),
              {
                icon: (
                  <img
                    className="h-5 w-5 rounded-full border-2 border-white dark:border-gray-800"
                    src={usersMock[usersMock.length - 1]!.icon}
                  />
                ),
                value: usersMock[usersMock.length - 1]!.name,
                isSelected: false,
              },
              {
                icon: (
                  <img
                    className="h-5 w-5 rounded-full border-2 border-white dark:border-gray-800"
                    src={usersMock[usersMock.length - 2]!.icon}
                  />
                ),
                value: usersMock[usersMock.length - 2]!.name,
                isSelected: false,
              },
            ],
          ]}
          onSelectedItem={() => ""}
          title="Contributors"
        />
      </div>
      <div className="order-3 w-fit">
        <h3 className="mb-4 text-sm font-semibold">Timeline</h3>
        <section className="flex flex-col gap-4">
          {datasets.map((x) => (
            <DashboardDatasetCard {...x} />
          ))}
        </section>
      </div>
      <div className="order-2 space-y-2.5 border-b-[1px] pt-3 sm:order-3 sm:w-[340px] sm:max-w-[340px] sm:border-b-0 sm:border-l-[1px] sm:pl-3">
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

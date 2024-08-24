import Tabs from "@components/_shared/Tabs";

export default function OrganizationTabs({ current }: { current: string }) {
  let tabs = [
    { name: "Edit", href: "edit", current: false },
    { name: "Members", href: "members", current: false },
  ];
  tabs = tabs.map((t) => ({ ...t, current: t.href == current }));
  return <Tabs tabs={tabs} />;
}

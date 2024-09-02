import TextDivisor from "@components/_shared/TextDivisor";
import { TagsButtonsSelectionGroup } from "@components/ui/tags-buttons-selection-group";

export default ({
  locations,
  setLocations,
  topics,
  setTopics,
  organizations,
  setOrganizations,
}: {
  locations: any;
  setLocations: any;
  topics: any;
  setTopics: any;
  organizations: any;
  setOrganizations: any;
}) => {
  return (
    <>
      <h2 className="text-xl font-bold text-[#111928]">
        Select locations, topics and organisations you want to follow
      </h2>
      <div>
        <div className="space-y-5">
          <TextDivisor text="Locations" />
          <TagsButtonsSelectionGroup data={locations} setData={setLocations} />
          <TextDivisor text="Topics" />
          <TagsButtonsSelectionGroup data={topics} setData={setTopics} />
          <TextDivisor text="Organisations" />
          <TagsButtonsSelectionGroup
            data={organizations}
            setData={setOrganizations}
          />
        </div>
      </div>
    </>
  );
};

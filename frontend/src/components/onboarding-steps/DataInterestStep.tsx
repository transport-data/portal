import { TagsButtonsSelectionGroup } from "@components/ui/tags-buttons-selection-group";

export const DataInterestStep = ({ locations, setLocations, topics, setTopics, setOrganizations, organizations}) => {
  return (
    <div className="w-[50%] bg-white px-28 py-20">
      <div className="py-8">
        <h2 className="text-xl font-bold text-[#111928]">
          Select locations, topics and organisations you want to follow
        </h2>
        <div>
          <div>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-start">
                <span className="bg-white pr-6 text-sm font-semibold text-[#111928]">
                  Locations
                </span>
              </div>
            </div>
          </div>

          <TagsButtonsSelectionGroup data={locations} setData={setLocations} />

          <div>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-start">
                <span className="bg-white pr-6 text-sm font-semibold text-[#111928]">
                  Topics
                </span>
              </div>
            </div>
          </div>

          <TagsButtonsSelectionGroup data={topics} setData={setTopics} />

          <div>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-start">
                <span className="bg-white pr-6 text-sm font-semibold text-[#111928]">
                  Organisations
                </span>
              </div>
            </div>
          </div>

          <TagsButtonsSelectionGroup
            data={organizations}
            setData={setOrganizations}
          />
        </div>
      </div>
    </div>
  );
};

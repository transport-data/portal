import Heading from "@components/_shared/Heading";
import Subheading from "@components/_shared/SubHeading";
import { PersonProps } from "@pages/about-us";
import PersonCard from "./PersonCard";

export default function PeopleSection({
  people,
}: {
  people: Array<PersonProps>;
}) {
  return (
    <section className="container py-[96px]">
      <div className="mx-auto lg:max-w-[672px]">
        <Heading>The People Behind TDC</Heading>
        <Subheading className="mt-4">
          The TDC team consists of dedicated professionals who are passionate
          about sustainable transportation and are committed to facilitating
          data sharing, analysis, and collaboration for the benefit of the
          community.
        </Subheading>
      </div>
      {/* New subheading added here */}
      <div className="mt-[96px] text-center">
        <h3 className="text-xl font-medium text-gray-700">
          Current active members of TDC Working Groups
        </h3>
      </div>
      <div className="mt-[96px] grid grid-cols-1 gap-x-[32px] gap-y-[48px] md:grid-cols-3 lg:grid-cols-5">
        {people.map((person, index) => (
          <PersonCard
            title={person.title}
            subtitle={person.info}
            image={person.image}
            content={person.source}
            key={`people-${index}`}
          />
        ))}
      </div>
    </section>
  );
}

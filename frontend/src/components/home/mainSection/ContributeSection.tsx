import Heading from "@components/_shared/Heading";

export default function ContributeSection() {
  return (
    <div className="container py-[96px]">
      <div className="mx-auto text-center lg:max-w-[640px]">
        <Heading>Contribute data to the Transport Data Commons</Heading>
        <p className="mt-4 text-xl font-normal text-gray-500">
          Help us build a more comprehensive and diverse transportation data
          repository by contributing your own transportation-related datasets.
        </p>
      </div>
    </div>
  );
}

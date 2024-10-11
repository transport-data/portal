import { Dataset } from "@portaljs/ckan";

export function Overview({ introduction_text }: { introduction_text: string }) {
  return (
    <div className="bg-gray-50">
      <div className="container grid grid-cols-1 gap-6 lg:grid-cols-2 lg:py-16">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Introduction and key takeaways
          </h3>
        </div>
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: introduction_text,
            }}
            className="min-h-[60vh] prose text-justify marker:text-accent prose-p:mt-2 prose-p:text-gray-500 prose-a:text-accent prose-a:underline prose-ul:mt-2 prose-ul:decoration-accent prose-li:m-0"
          ></div>
        </div>
      </div>
    </div>
  );
}

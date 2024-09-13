import { Dataset } from "@portaljs/ckan";

export function Overview({ dataset }: { dataset: Dataset }) {
  return (
    <div className="bg-gray-50">
      <div className="container grid grid-cols-1 gap-6 lg:grid-cols-2 lg:py-16">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Introduction and key takeaways
          </h3>
          <div className="text-xs font-semibold leading-3 text-gray-500">
            EDITED BY
          </div>
          <figcaption className="mt-4 flex items-center gap-x-4">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
              className="h-12 w-12 rounded-full bg-gray-50"
            />
            <div className="text-sm leading-6">
              <div className="font-semibold text-gray-900">Judith Black</div>
              <div className="mt-0.5 text-gray-600">CEO of Workcation</div>
            </div>
          </figcaption>
          <figcaption className="mt-4 flex items-center gap-x-4">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
              className="h-12 w-12 rounded-full bg-gray-50"
            />
            <div className="text-sm leading-6">
              <div className="font-semibold text-gray-900">Judith Black</div>
              <div className="mt-0.5 text-gray-600">CEO of Workcation</div>
            </div>
          </figcaption>
        </div>
        <div>
          <div className="prose text-justify prose-p:text-gray-500 prose-a:text-accent prose-p:mt-2 prose-a:underline prose-ul:decoration-accent marker:text-accent prose-li:m-0 prose-ul:mt-2">
            <p>
              Measuring passenger activity is crucial for several reasons.
              Firstly, it helps transportation planners and policymakers
              understand the demand for different modes of transportation,
              enabling them to optimize infrastructure development and
              allocation of resources. By analyzing passenger activity, patterns
              of travel can be identified, allowing for better planning of
              routes, schedules, and capacity.
            </p>

            <p>
              Secondly, measuring passenger activity provides insights into
              travel behavior, such as peak hours, popular destinations, and
              trip purposes, which can inform the design of more efficient and
              sustainable transportation services.
            </p>

            <p>
              Lastly, it aids in assessing the effectiveness of sustainable
              transportation initiatives and policies by tracking changes in
              passenger activity over time, facilitating evidence-based
              decision-making and the identification of areas for improvement.
              Overall, measuring passenger activity is vital for creating
              transportation systems that are responsive to the needs of
              passengers, reduce congestion and emissions, and promote
              sustainable mobility.
            </p>

            <strong>Sources</strong>
            <ul>
              <li>
                <a href="#">Asian Transport Outlook (ATO)</a>
              </li>
              <li>
                <a href="#">
                  Integrated Database of the European Energy System (JRC-IDEES)
                </a>
              </li>
            </ul>

            <strong>Last updated date</strong>
            <p>23 March, 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
}

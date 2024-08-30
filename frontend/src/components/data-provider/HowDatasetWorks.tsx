import { Badge } from "@components/ui/badge";
import { CheckCircleIcon, CheckIcon } from "@heroicons/react/20/solid";

export default () => {
  return (
    <div className="container min-w-full bg-white py-6 text-gray-500 lg:px-20 lg:py-[96px]">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          How TDC datasets work?
        </h1>
        <p className="mt-4 text-xl font-normal text-gray-500">
          TDC hosts a diverse range of dataset types with differing variety of
          scope and standardisation, providing a comprehensive resource for
          analysing and addressing sustainable transportation challenges.
        </p>
      </div>

      <div className="mt-16 flex w-full flex-col flex-wrap gap-32 lg:flex-row lg:gap-8 xl:justify-center">
        <div className="flex flex-col-reverse gap-8 lg:w-[296px] lg:min-w-[296px] lg:flex-col">
          <div className="flex min-h-fit flex-col items-center gap-32 lg:flex-row lg:gap-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#E1EFFE]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M19.9998 39.2C25.092 39.2 29.9756 37.1771 33.5763 33.5764C37.177 29.9757 39.1998 25.0921 39.1998 20C39.1998 14.9078 37.177 10.0242 33.5763 6.42354C29.9756 2.82284 25.092 0.799988 19.9998 0.799988C14.9076 0.799988 10.0241 2.82284 6.42336 6.42354C2.82266 10.0242 0.799805 14.9078 0.799805 20C0.799805 25.0921 2.82266 29.9757 6.42336 33.5764C10.0241 37.1771 14.9076 39.2 19.9998 39.2ZM6.3966 15.2648C7.2877 12.7129 8.87769 10.4626 10.9854 8.77039C11.6286 9.75199 12.7374 10.4 13.9998 10.4C14.9546 10.4 15.8703 10.7793 16.5454 11.4544C17.2205 12.1295 17.5998 13.0452 17.5998 14V15.2C17.5998 16.473 18.1055 17.6939 19.0057 18.5941C19.9059 19.4943 21.1268 20 22.3998 20C23.6728 20 24.8937 19.4943 25.7939 18.5941C26.6941 17.6939 27.1998 16.473 27.1998 15.2C27.1994 14.1258 27.5594 13.0825 28.222 12.2371C28.8847 11.3917 29.8118 10.793 30.855 10.5368C33.1453 13.1568 34.4052 16.52 34.3998 20C34.3998 20.816 34.3326 21.62 34.2006 22.4H31.9998C30.7268 22.4 29.5059 22.9057 28.6057 23.8059C27.7055 24.7061 27.1998 25.927 27.1998 27.2V32.4728C25.0117 33.7388 22.5278 34.4037 19.9998 34.4V29.6C19.9998 28.327 19.4941 27.1061 18.5939 26.2059C17.6937 25.3057 16.4728 24.8 15.1998 24.8C13.9268 24.8 12.7059 24.2943 11.8057 23.3941C10.9055 22.4939 10.3998 21.273 10.3998 20C10.4002 18.8648 9.9983 17.7662 9.2654 16.8993C8.5325 16.0323 7.51606 15.4532 6.3966 15.2648Z"
                  fill="#1C64F2"
                />
              </svg>
            </div>
            <LongArrowRightIcon className="rotate-90 lg:rotate-0" />
          </div>
          <section className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Public Data</h1>
            <p>
              Data from open public repositories collected and aggregated by TDC
              for ease of access.
            </p>
            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E1EFFE] text-[#1C64F2]">
                <CheckIcon width={14} />
              </span>
              Publicly available data{" "}
            </p>
            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E1EFFE] text-[#1C64F2]">
                <CheckIcon width={14} />
              </span>
              All in one place for ease of access
            </p>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-8 lg:w-[296px] lg:min-w-[296px] lg:flex-col">
          <div className="flex min-h-fit flex-col items-center gap-32 lg:flex-row lg:gap-8">
            <Badge
              className="flex h-16 w-16 items-center"
              icon={
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.2002 28.8V36C7.2002 39.9768 14.7218 43.2 24.0002 43.2C33.2786 43.2 40.8002 39.9768 40.8002 36V28.8C40.8002 32.7768 33.2786 36 24.0002 36C14.7218 36 7.2002 32.7768 7.2002 28.8Z"
                    fill="#7E3AF2"
                  />
                  <path
                    d="M7.2002 16.8V24C7.2002 27.9768 14.7218 31.2 24.0002 31.2C33.2786 31.2 40.8002 27.9768 40.8002 24V16.8C40.8002 20.7768 33.2786 24 24.0002 24C14.7218 24 7.2002 20.7768 7.2002 16.8Z"
                    fill="#7E3AF2"
                  />
                  <path
                    d="M40.8002 12C40.8002 15.9768 33.2786 19.2 24.0002 19.2C14.7218 19.2 7.2002 15.9768 7.2002 12C7.2002 8.02319 14.7218 4.79999 24.0002 4.79999C33.2786 4.79999 40.8002 8.02319 40.8002 12Z"
                    fill="#7E3AF2"
                  />
                </svg>
              }
              variant="purple"
            />
            <LongArrowRightIcon className="rotate-90 lg:rotate-0" />
          </div>
          <section className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Community Data</h1>
            <p>Datasets submitted by individuals and organisation partners.</p>
            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EDEBFE] text-[#7E3AF2]">
                <CheckIcon width={14} />
              </span>
              Moderated by TDC{" "}
            </p>
            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EDEBFE] text-[#7E3AF2]">
                <CheckIcon width={14} />
              </span>
              Low submission threshold
            </p>

            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EDEBFE] text-[#7E3AF2]">
                <CheckIcon width={14} />
              </span>
              Help with transition to TDC standard
            </p>
          </section>
        </div>
        <div className="flex flex-col-reverse gap-8 lg:w-[296px] lg:min-w-[296px] lg:flex-col">
          <div className="flex min-h-fit flex-col items-center gap-32 lg:flex-row lg:gap-8">
            <Badge
              className="flex h-16 w-16 items-center pl-3"
              icon={<CheckCircleIcon width={40} height={40} />}
              variant="success"
            ></Badge>
            <LongArrowRightIcon className="rotate-90 lg:rotate-0" />
          </div>
          <section className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">TDC Formatted</h1>
            <p>
              Datasets that are already SDMX formatted or added via API and
              programmed SDMX converter.
            </p>
            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#DEF7EC] text-[#0694A2]">
                <CheckIcon width={14} />
              </span>
              No change of data, labels, categories, etc
            </p>
            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#DEF7EC] text-[#0694A2]">
                <CheckIcon width={14} />
              </span>
              No modification of data
            </p>

            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#DEF7EC] text-[#0694A2]">
                <CheckIcon width={14} />
              </span>
              No data quality check
            </p>
          </section>
        </div>
        <div className="flex flex-col-reverse gap-8 lg:w-[296px] lg:min-w-[296px] lg:flex-col">
          <div className="flex min-h-fit flex-col items-center gap-32 lg:flex-row lg:gap-8">
            <Badge
              className="flex h-16 w-16 items-center pl-4"
              icon={
                <svg
                  width="32"
                  height="34"
                  viewBox="0 0 32 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.332 6.99794C6.12227 6.92594 11.6896 4.75486 16 0.887939C20.3101 4.75558 25.8775 6.92739 31.668 6.99994C31.888 8.29994 32 9.63994 32 11.0019C32 21.4519 25.32 30.3419 16 33.6359C6.68 30.3399 0 21.4499 0 10.9999C0 9.63594 0.114 8.29994 0.332 6.99794V6.99794ZM23.414 14.4139C23.7783 14.0367 23.9799 13.5315 23.9753 13.0071C23.9708 12.4827 23.7605 11.9811 23.3896 11.6103C23.0188 11.2395 22.5172 11.0291 21.9928 11.0246C21.4684 11.02 20.9632 11.2216 20.586 11.5859L14 18.1719L11.414 15.5859C11.0368 15.2216 10.5316 15.02 10.0072 15.0246C9.4828 15.0291 8.98118 15.2395 8.61036 15.6103C8.23955 15.9811 8.02921 16.4827 8.02465 17.0071C8.02009 17.5315 8.22168 18.0367 8.586 18.4139L12.586 22.4139C12.9611 22.7889 13.4697 22.9995 14 22.9995C14.5303 22.9995 15.0389 22.7889 15.414 22.4139L23.414 14.4139V14.4139Z"
                    fill="#C27803"
                  />
                </svg>
              }
              variant="warning"
            ></Badge>
          </div>
          <section className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">TDC Harmonised</h1>
            <p>
              Datasets that have been formatted, validated, and derived from
              multiple sources by TDC.
            </p>
            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FDF6B2] text-[#C27803]">
                <CheckIcon width={14} />
              </span>
              Comprehensive source of data
            </p>
            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FDF6B2] text-[#C27803]">
                <CheckIcon width={14} />
              </span>
              Validated and harmonised by TDC
            </p>

            <p className="flex items-center gap-2.5">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FDF6B2] text-[#C27803]">
                <CheckIcon width={14} />
              </span>
              Based on transparent standards
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const LongArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="200"
    height="24"
    viewBox="0 0 200 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M201.061 13.0607C201.646 12.4749 201.646 11.5251 201.061 10.9393L191.515 1.3934C190.929 0.807611 189.979 0.807611 189.393 1.3934C188.808 1.97919 188.808 2.92893 189.393 3.51472L197.879 12L189.393 20.4853C188.808 21.0711 188.808 22.0208 189.393 22.6066C189.979 23.1924 190.929 23.1924 191.515 22.6066L201.061 13.0607ZM0 13.5H200V10.5H0V13.5Z"
      fill="#E5E7EB"
    />
  </svg>
);

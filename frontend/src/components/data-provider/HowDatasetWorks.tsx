import { Badge } from "@components/ui/badge";
import { CheckCircleIcon, CircleStackIcon } from "@heroicons/react/20/solid";

export default () => {
  return (
    <div className="container py-[96px]">
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

      <div className="mt-16 flex w-full gap-8">
        <div className="flex w-[296px] flex-col gap-8">
          <div className="flex items-center gap-8">
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
            <LongArrowRightIcon />
          </div>
          <section className="space-y-4">
            <h1 className="text-xl font-bold">Public Data</h1>
            <p>
              <CheckCircleIcon className="text-secondary-hover" />
              <CheckCircleIcon className="text-[#E1EFFE] "  />
              Data from open public repositories collected and aggregated by TDC
              for ease of access.
            </p>
            <p>Publicly available data </p>
            <p>All in one place for ease of access</p>
          </section>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-8">
            <Badge
              className="h-16 w-16"
              icon={<CircleStackIcon />}
              variant="purple"
            />
            <LongArrowRightIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

const LongArrowRightIcon = () => (
  <svg
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

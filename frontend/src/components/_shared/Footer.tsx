import Image from "next/image";
import Link from "next/link";

interface IconProps {
  className: string;
  "aria-hidden": boolean;
}

const Footer: React.FC = () => {
  const navigation = {
    resources: [
      {
        name: "Datasets",
        href: "/datasets",
      },
      {
        name: "Geography",
        href: "/geography",
      },
      {
        name: "FAQ",
        href: "/faq",
      },
    ],
    organisation: [
      { name: "About Us", href: "/about-us" },
      { name: "Partners", href: "/partners" },
      { name: "Events", href: "/events" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy and Policy", href: "#" },
      { name: "Terms and Conditions", href: "#" },
      { name: "EULA", href: "#" },
    ],
    social: [
      {
        name: "github",
        href: "https://github.com/transport-data",
        icon: (props: IconProps) => (
          <svg
            fill="currentColor"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M5.80078 13.7109C5.80078 13.6406 5.73047 13.5703 5.625 13.5703C5.51953 13.5703 5.44922 13.6406 5.44922 13.7109C5.44922 13.7812 5.51953 13.8516 5.625 13.8164C5.73047 13.8164 5.80078 13.7812 5.80078 13.7109ZM4.71094 13.5352C4.71094 13.6055 4.78125 13.7109 4.88672 13.7109C4.95703 13.7461 5.0625 13.7109 5.09766 13.6406C5.09766 13.5703 5.0625 13.5 4.95703 13.4648C4.85156 13.4297 4.74609 13.4648 4.71094 13.5352ZM6.29297 13.5C6.1875 13.5 6.11719 13.5703 6.11719 13.6758C6.11719 13.7461 6.22266 13.7812 6.32812 13.7461C6.43359 13.7109 6.50391 13.6758 6.46875 13.6055C6.46875 13.5352 6.36328 13.4648 6.29297 13.5ZM8.57812 0C3.72656 0 0 3.72656 0 8.57812C0 12.4805 2.42578 15.8203 5.94141 17.0156C6.39844 17.0859 6.53906 16.8047 6.53906 16.5938C6.53906 16.3477 6.53906 15.1523 6.53906 14.4141C6.53906 14.4141 4.07812 14.9414 3.55078 13.3594C3.55078 13.3594 3.16406 12.3398 2.60156 12.0938C2.60156 12.0938 1.79297 11.5312 2.63672 11.5312C2.63672 11.5312 3.51562 11.6016 4.00781 12.4453C4.78125 13.8164 6.04688 13.4297 6.57422 13.1836C6.64453 12.6211 6.85547 12.2344 7.13672 11.9883C5.16797 11.7773 3.16406 11.4961 3.16406 8.12109C3.16406 7.13672 3.44531 6.67969 4.00781 6.04688C3.90234 5.80078 3.62109 4.88672 4.11328 3.65625C4.81641 3.44531 6.53906 4.60547 6.53906 4.60547C7.24219 4.39453 7.98047 4.32422 8.71875 4.32422C9.49219 4.32422 10.2305 4.39453 10.9336 4.60547C10.9336 4.60547 12.6211 3.41016 13.3594 3.65625C13.8516 4.88672 13.5352 5.80078 13.4648 6.04688C14.0273 6.67969 14.3789 7.13672 14.3789 8.12109C14.3789 11.4961 12.3047 11.7773 10.3359 11.9883C10.6523 12.2695 10.9336 12.7969 10.9336 13.6406C10.9336 14.8008 10.8984 16.2773 10.8984 16.5586C10.8984 16.8047 11.0742 17.0859 11.5312 16.9805C15.0469 15.8203 17.4375 12.4805 17.4375 8.57812C17.4375 3.72656 13.4648 0 8.57812 0ZM3.41016 12.1289C3.33984 12.1641 3.375 12.2695 3.41016 12.3398C3.48047 12.375 3.55078 12.4102 3.62109 12.375C3.65625 12.3398 3.65625 12.2344 3.58594 12.1641C3.51562 12.1289 3.44531 12.0938 3.41016 12.1289ZM3.02344 11.8477C2.98828 11.918 3.02344 11.9531 3.09375 11.9883C3.16406 12.0234 3.23438 12.0234 3.26953 11.9531C3.26953 11.918 3.23438 11.8828 3.16406 11.8477C3.09375 11.8125 3.05859 11.8125 3.02344 11.8477ZM4.14844 13.1133C4.11328 13.1484 4.11328 13.2539 4.21875 13.3242C4.28906 13.3945 4.39453 13.4297 4.42969 13.3594C4.46484 13.3242 4.46484 13.2188 4.39453 13.1484C4.32422 13.0781 4.21875 13.043 4.14844 13.1133ZM3.76172 12.5859C3.69141 12.6211 3.69141 12.7266 3.76172 12.7969C3.83203 12.8672 3.90234 12.9023 3.97266 12.8672C4.00781 12.832 4.00781 12.7266 3.97266 12.6562C3.90234 12.5859 3.83203 12.5508 3.76172 12.5859Z" />
          </svg>
        ),
      },
      {
        name: "twitter",
        href: "https://twitter.com",
        icon: (props: IconProps) => (
          <svg fill="currentColor" viewBox="0 0 64 64" {...props}>
            <path
              fillRule="evenodd"
              d="M60.448 15.109a24.276 24.276 0 0 1-3.288.968.5.5 0 0 1-.451-.853 15.146 15.146 0 0 0 3.119-4.263.5.5 0 0 0-.677-.662 18.6 18.6 0 0 1-6.527 2.071 12.92 12.92 0 0 0-9-3.75A12.363 12.363 0 0 0 31.25 20.994a12.727 12.727 0 0 0 .281 2.719c-9.048-.274-19.61-4.647-25.781-12.249a.5.5 0 0 0-.83.073 12.475 12.475 0 0 0 2.956 14.79.5.5 0 0 1-.344.887 7.749 7.749 0 0 1-3.1-.8.5.5 0 0 0-.725.477 11.653 11.653 0 0 0 7.979 10.567.5.5 0 0 1-.09.964 12.567 12.567 0 0 1-2.834 0 .506.506 0 0 0-.536.635c.849 3.282 5.092 7.125 9.839 7.652a.5.5 0 0 1 .267.87 20.943 20.943 0 0 1-14 4.577.5.5 0 0 0-.255.942 37.29 37.29 0 0 0 17.33 4.266 34.5 34.5 0 0 0 34.687-36.182v-.469a21.11 21.11 0 0 0 4.934-4.839.5.5 0 0 0-.58-.765z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "linkedin",
        href: "https://www.linkedin.com",
        icon: (props: IconProps) => (
          <svg
            width="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M42.7519 2H5.24805C4.38662 2 3.56046 2.34221 2.95133 2.95133C2.3422 3.56046 2 4.38662 2 5.24806V42.7519C2 43.6134 2.3422 44.4395 2.95133 45.0487C3.56046 45.6578 4.38662 46 5.24805 46H42.7519C43.6134 46 44.4395 45.6578 45.0487 45.0487C45.6578 44.4395 46 43.6134 46 42.7519V5.24806C46 4.38662 45.6578 3.56046 45.0487 2.95133C44.4395 2.34221 43.6134 2 42.7519 2ZM15.1144 39.4825H8.49917V18.4694H15.1144V39.4825ZM11.8022 15.5575C11.0518 15.5533 10.3195 15.3269 9.69768 14.9068C9.07585 14.4868 8.59237 13.892 8.30827 13.1974C8.02418 12.5029 7.95219 11.7398 8.10139 11.0043C8.25059 10.2689 8.6143 9.59417 9.14662 9.06527C9.67893 8.53636 10.356 8.17699 11.0924 8.03251C11.8287 7.88803 12.5914 7.96492 13.2841 8.25347C13.9768 8.54203 14.5685 9.02931 14.9845 9.65382C15.4005 10.2783 15.6223 11.0121 15.6217 11.7625C15.6287 12.2649 15.5346 12.7636 15.3449 13.2288C15.1551 13.694 14.8736 14.1163 14.5172 14.4705C14.1608 14.8246 13.7367 15.1034 13.2703 15.2901C12.8038 15.4769 12.3046 15.5678 11.8022 15.5575ZM39.4978 39.5008H32.8856V28.0211C32.8856 24.6356 31.4464 23.5906 29.5886 23.5906C27.6269 23.5906 25.7019 25.0694 25.7019 28.1067V39.5008H19.0867V18.4847H25.4483V21.3967H25.5339C26.1725 20.1042 28.4092 17.895 31.8222 17.895C35.5133 17.895 39.5008 20.0858 39.5008 26.5025L39.4978 39.5008Z"
              fill="#9CA3AF"
            />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className="border-t border-gray-100 bg-gray-50 py-[64px]">
      <div className="container flex flex-col gap-[48px]">
        <div className="flex flex-col gap-x-16 lg:flex-row">
          <div className="lg:w-[384px]">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <Image
                alt="Transport Data Commons"
                src="/images/logos/tdc-logo.svg"
                width={300}
                height={32}
              />
            </Link>
            <p className="mt-[20px] text-sm text-gray-500">
              Transport Data Commons is an initiative of individuals and
              organizations who are passionate about sustainable transportation
              and want to increase the use and impact of data in this sector.
            </p>
            <div className="mt-[20px] flex gap-[20px]">
              {navigation.social.map((social, i) => (
                <Link
                  key={`footer-social-${i}`}
                  href={social.href}
                  target="_blank"
                  className="block"
                >
                  <social.icon className="w-[18px] text-gray-400" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-8 sm:flex-row lg:ml-auto lg:mt-0">
            <div className="w-full lg:w-[176px]">
              <h4 className="mb-[16px] text-sm font-semibold uppercase text-gray-900">
                Resources
              </h4>
              <ul className="flex flex-col gap-y-[16px]">
                {navigation.resources.map((item, i) => (
                  <li key={`resources-menu-${i}`}>
                    <a href={item.href} className="text-gray-500">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-[176px]">
              <h4 className="mb-[16px] text-sm font-semibold uppercase text-gray-900">
                Organisation
              </h4>
              <ul className="flex flex-col gap-y-[16px]">
                {navigation.organisation.map((item, i) => (
                  <li key={`org-menu-${i}`}>
                    <a href={item.href} className="text-gray-500">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-[176px]">
              <h4 className="mb-[16px] text-sm font-semibold uppercase text-gray-900">
                Legal
              </h4>
              <ul className="flex flex-col gap-y-[16px]">
                {navigation.legal.map((item, i) => (
                  <li key={`legal-menu-${i}`}>
                    <a href={item.href} className="text-gray-500">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full text-center">
          <hr />
          <p className="mt-8 text-gray-500">
            &copy; {new Date().getFullYear()} TDC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import getConfig from "next/config";
import Image from "next/image";
import { Organization } from "@portaljs/ckan";
import styles from "@/styles/DatasetInfo.module.scss";
import { env } from "@env.mjs";

type OrganizationInfoProps = Pick<
  Organization,
  "title" | "image_url" | "description"
>;

export default function OrganizationInfo({
  title,
  image_url,
  description,
}: OrganizationInfoProps) {
  return (
    <div className={styles.card}>
      <section className={styles.organization}>
        {image_url && (
          <div>
            <Image
              src={`${
                env.NEXT_PUBLIC_CKAN_URL
              }/uploads/group/${image_url}`}
              width={100}
              height={100}
              alt={`${title} logo`}
            />
          </div>
        )}
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </section>
    </div>
  );
}

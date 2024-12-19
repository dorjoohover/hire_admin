import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { DropdownIcon, RightIcon } from "./Icons";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isTestPage = pathname === "/test";

  return (
    <>
      <div className="border-b p-6 py-3 flex items-center gap-7">
        <Link href={"/"}>
          <Image src="/axiom.png" width={70} height={10} alt="Axiom Logo" />
        </Link>
        {/* {isTestPage && (
          <>
            <div className="flex items-center">
              <div
                className="cursor-pointer hover:bg-bg30 hover:text-main px-2 rounded-md"
                onClick={() => router.push("/")}
              >
                Тестүүд
              </div>
              <div className="rotate transform-180">
                <RightIcon width={14} />
              </div>
              <div className="font-bold px-2">Чадамжийн тест</div>
            </div>
          </>
        )} */}
      </div>
    </>
  );
};

export default Header;

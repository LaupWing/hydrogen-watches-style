import { Await, NavLink, useMatches } from "@remix-run/react"
import { Suspense } from "react"
import type { LayoutProps } from "./Layout"
import { BiSolidCartAlt, BiSolidSearchAlt2 } from "react-icons/bi"

type HeaderProps = Pick<LayoutProps, "header" | "cart" | "isLoggedIn">

type Viewport = "desktop" | "mobile"

export function Header({ header, isLoggedIn, cart }: HeaderProps) {
   const { shop, menu } = header
   return (
      <header className="justify-between custom-container">
         <NavLink 
            prefetch="intent" 
            to="/" 
            style={activeLinkStyle} 
            end
         >
            <strong>{shop.name}</strong>
         </NavLink>
         <HeaderMenu isLoggedIn={isLoggedIn} menu={menu} viewport="desktop" />
         <HeaderCtas cart={cart} />
      </header>
   )
}

export function HeaderMenu({
   menu,
   viewport,
   isLoggedIn,
}: {
   menu: HeaderProps["header"]["menu"]
   viewport: Viewport,
   isLoggedIn?: boolean
}) {
   const [root] = useMatches()
   const publicStoreDomain = root?.data?.publicStoreDomain
   const className = `header-menu-${viewport}`

   function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
      if (viewport === "mobile") {
         event.preventDefault()
         window.location.href = event.currentTarget.href
      }
   }

   return (
      <nav className={`${className} uppercase text-sm gap-2 flex tracking-wider font-semibold`} role="navigation">
         {viewport === "mobile" && (
            <NavLink
               end
               onClick={closeAside}
               prefetch="intent"
               style={activeLinkStyle}
               to="/"
            >
               Home
            </NavLink>
         )}
         {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            if (!item.url) return null

            // if the url is internal, we strip the domain
            const url =
               item.url.includes("myshopify.com") ||
               item.url.includes(publicStoreDomain)
                  ? new URL(item.url).pathname
                  : item.url
            return (
               <NavLink
                  className={activeClassName}
                  end
                  key={item.id}
                  onClick={closeAside}
                  prefetch="intent"
                  to={url}
               >
                  {item.title}
               </NavLink>
            )
         })}
         <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
            {isLoggedIn ? "Account" : "Sign in"}
         </NavLink>
      </nav>
   )
}

function HeaderCtas({
   cart,
}: Pick<HeaderProps, "cart">) {
   return (
      <nav className="flex gap-4" role="navigation">
         <HeaderMenuMobileToggle />
         <SearchToggle />
         <CartToggle cart={cart} />
      </nav>
   )
}

function HeaderMenuMobileToggle() {
   return (
      <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
         <h3>☰</h3>
      </a>
   )
}

function SearchToggle() {
   return (
      <a 
         className="relative text-white w-8 h-8 rounded-full items-center justify-center bg-red-900 flex" 
         href="#search-aside"
      >
         <BiSolidSearchAlt2 
            size={18}
         />  
      </a>
   )
}

function CartBadge({ count }: { count: number }) {
   return (
      <a 
         className="relative text-white w-8 h-8 rounded-full items-center justify-center bg-accent flex" 
         href="#cart-aside"
      >
         <BiSolidCartAlt 
            size={16}
         />  
         <span className="absolute bg-white/80 w-4 h-4 flex items-center justify-center rounded-full -bottom-1 right-0 text-black">
            {count}
         </span> 
      </a>
   )
}

function CartToggle({ cart }: Pick<HeaderProps, "cart">) {
   return (
      <Suspense fallback={<CartBadge count={0} />}>
         <Await resolve={cart}>
            {(cart) => {
               if (!cart) return <CartBadge count={0} />
               return <CartBadge count={cart.totalQuantity || 0} />
            }}
         </Await>
      </Suspense>
   )
}

const FALLBACK_HEADER_MENU = {
   id: "gid://shopify/Menu/199655587896",
   items: [
      {
         id: "gid://shopify/MenuItem/461609500728",
         resourceId: null,
         tags: [],
         title: "Collections",
         type: "HTTP",
         url: "/collections",
         items: [],
      },
      {
         id: "gid://shopify/MenuItem/461609533496",
         resourceId: null,
         tags: [],
         title: "Blog",
         type: "HTTP",
         url: "/blogs/journal",
         items: [],
      },
      {
         id: "gid://shopify/MenuItem/461609566264",
         resourceId: null,
         tags: [],
         title: "Policies",
         type: "HTTP",
         url: "/policies",
         items: [],
      },
      {
         id: "gid://shopify/MenuItem/461609599032",
         resourceId: "gid://shopify/Page/92591030328",
         tags: [],
         title: "About",
         type: "PAGE",
         url: "/pages/about",
         items: [],
      },
   ],
}

function activeLinkStyle({
   isActive,
   isPending,
}: {
   isActive: boolean
   isPending: boolean
}) {
   return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "grey" : "black",
   }
}

function activeClassName({
   isActive,
   isPending,
}: {
   isActive: boolean
   isPending: boolean
}) {
   return isActive ? "text-accent border-b-2 border-accent" : ""
}

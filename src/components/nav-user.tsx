import UserProfile from "~/components/user-profile"
import { api } from "~/trpc/server"

export async function NavUser() {
  const [userInfo, paymentStatus] = await Promise.all([
    api.user.getProfile(),
    api.payment.getUserPurchaseStatus(),
  ])

  return (
    <div className="overflow-hidden">
      <UserProfile userInfo={userInfo} paymentStatus={paymentStatus} />
    </div>
  )
}

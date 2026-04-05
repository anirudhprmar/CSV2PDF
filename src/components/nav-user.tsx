import UserProfile from "~/components/user-profile"

export async function NavUser() {


  return (
    <div className="overflow-hidden">
      <UserProfile userInfo={userInfo} paymentStatus={paymentStatus} />
    </div>
  )
}

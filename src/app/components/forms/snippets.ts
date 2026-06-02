export const LOGIN_CODE = `const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
})

type LoginInput = z.input<typeof loginSchema>
type LoginValues = z.output<typeof loginSchema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginInput, unknown, LoginValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: "", password: "", rememberMe: false },
    })

  const onSubmit = async (data: LoginValues) => {
    await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(data) })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-semibold">Email</label>
        <input type="email" {...register("email")} placeholder="name@company.com"
          className="w-full rounded-lg border px-4 py-2.5 text-sm" />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold">Password</label>
        <input type="password" {...register("password")} placeholder="••••••••"
          className="w-full rounded-lg border px-4 py-2.5 text-sm" />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="flex items-center gap-2 py-2">
        <input type="checkbox" id="remember" {...register("rememberMe")} />
        <label htmlFor="remember" className="text-sm">Keep me logged in</label>
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full py-3 font-bold text-white rounded-lg bg-primary">
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}`;

export const SETTINGS_CODE = `const settingsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  emailUpdates: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
})

type SettingsInput = z.input<typeof settingsSchema>
type SettingsValues = z.output<typeof settingsSchema>

export function SettingsForm() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<SettingsInput, unknown, SettingsValues>({
      resolver: zodResolver(settingsSchema),
      defaultValues: {
        firstName: "Jane",
        lastName: "Cooper",
        bio: "",
        emailUpdates: true,
        pushNotifications: false,
      },
    })

  return (
    <form onSubmit={handleSubmit(console.log)} className="divide-y divide-slate-100">
      <div className="grid grid-cols-3 gap-6 py-6">
        <div>
          <h4 className="text-sm font-bold">Profile</h4>
          <p className="mt-1 text-xs text-slate-500">
            This information will be displayed publicly.
          </p>
        </div>
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold uppercase">First Name</label>
              <input type="text" {...register("firstName")}
                className="w-full rounded-lg border bg-slate-50 text-sm" />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold uppercase">Last Name</label>
              <input type="text" {...register("lastName")}
                className="w-full rounded-lg border bg-slate-50 text-sm" />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-xs font-bold uppercase">Biography</label>
            <textarea {...register("bio")} placeholder="Tell us a bit about yourself..."
              className="w-full h-24 rounded-lg border bg-slate-50 text-sm" />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6">
        <button type="submit"
          className="px-6 py-2 text-sm font-bold text-white rounded-lg bg-primary">
          Save Changes
        </button>
      </div>
    </form>
  )
}`;

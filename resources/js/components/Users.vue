<template>
  <div class="container">
    <div class="row justify-content-center my-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header d-flex">
            <h3 class="box-title mb-0">Users Table</h3>

            <div class="card-tools ml-auto mr-2">
              <button
                type="button"
                class="btn btn-success"
                data-toggle="modal"
                data-target="#addNew"
              >
                <i class="fa fa-user-plus"></i> Add User
              </button>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body table-responsive p-0">
            <table class="table table-hover">
              <tbody>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered At</th>
                  <th>Modify</th>
                </tr>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name | capitalize }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span>{{ user.role | capitalize }}</span>
                  </td>
                  <td>{{ user.created_at | formattedDate }}</td>
                  <td class="text-center">
                    <a
                      href="#"
                      class="btn btn-sm btn-info text-white mr-2"
                      style="width:25% !important;"
                    >
                      <i class="fa fa-user-edit"></i>
                    </a>
                    <a href="#" class="btn btn-sm btn-danger" style="width:25% !important;">
                      <i class="fa fa-user-times"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.card-body -->
        </div>
        <!-- /.card -->
      </div>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="addNew"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addNewLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addNewLabel">Add New</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="createUser">
            <div class="modal-body">
              <div class="form-group">
                <label>Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                />
                <has-error :form="form" field="name"></has-error>
              </div>

              <div class="form-group">
                <label>Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('email') }"
                />
                <has-error :form="form" field="email"></has-error>
              </div>

              <div class="form-group">
                <label>Bio</label>
                <textarea
                  v-model="form.bio"
                  name="bio"
                  id="bio"
                  rows="6"
                  placeholder="Enter your bio (optional)"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('bio') }"
                ></textarea>
                <has-error :form="form" field="bio"></has-error>
              </div>

              <div class="form-group">
                <label>Role</label>
                <select
                  v-model="form.role"
                  name="role"
                  id="role"
                  placeholder="Select your role"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('role') }"
                >
                  <option value>Select user role</option>
                  <option value="admin">Admin</option>
                  <option value="user">Standard User</option>
                  <option value="author">Author</option>
                </select>
                <has-error :form="form" field="role"></has-error>
              </div>

              <div class="form-group">
                <label>Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('password') }"
                />
                <has-error :form="form" field="password"></has-error>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">
                <i class="fa fa-user-times"></i> Close
              </button>
              <button :disabled="form.busy" type="submit" class="btn btn-success">
                <i class="fa fa-user-check"></i> Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: {},
      form: new Form({
        name: "",
        email: "",
        password: "",
        role: "",
        bio: "",
        avatar: ""
      })
    };
  },
  methods: {
    loadUsers() {
      axios.get("/api/users").then(({ data }) => (this.users = data.data));
    },

    createUser() {
      this.form
        .post("api/users")
        .then(() => {
          this.$Progress.start();

          Fire.$emit("AfterCreate");

          $("#addNew").modal("hide");

          Toast.fire({
            icon: "success",
            title: "User created successfully"
          });

          this.$Progress.finish();
        })
        .catch();
    }
  },
  created() {
    this.loadUsers();
    Fire.$on("AfterCreate", () => {
      setTimeout(() => {
        this.loadUsers();
      }, 500);
    });
  }
};
</script>

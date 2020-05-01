<template>
  <div class="container">
    <div class="row justify-content-center my-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header d-flex">
            <h3 class="box-title mb-0">Users Table</h3>

            <div class="card-tools ml-auto mr-2">
              <button @click="newModal" type="button" class="btn btn-success">
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
                      @click="editModal(user)"
                      href="#"
                      class="btn btn-sm btn-info text-white mr-2"
                      style="width:25% !important;"
                    >
                      <i class="fa fa-user-edit"></i>
                    </a>
                    <a
                      @click="deleteUser(user.id)"
                      href="#"
                      class="btn btn-sm btn-danger"
                      style="width:25% !important;"
                    >
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
            <h5 v-show="!editmode" class="modal-title" id="addNewLabel">Add User</h5>
            <h5 v-show="editmode" class="modal-title" id="addNewLabel">Update User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="editmode ? updateUser() : createUser()">
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
              <button
                :disabled="form.busy"
                type="submit"
                class="btn btn-success"
                v-show="!editmode"
              >
                <i class="fa fa-user-check"></i> Create
              </button>
              <button
                :disabled="form.busy"
                type="submit"
                class="btn btn-info text-white"
                v-show="editmode"
              >
                <i class="fa fa-user-check text-white"></i> Update
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
      editmode: false,
      users: {},
      form: new Form({
        id: "",
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
    updateUser() {
      this.form
        .put("api/users/" + this.form.id)
        .then(() => {
          this.$Progress.start();

          Fire.$emit("emitChanges");

          $("#addNew").modal("hide");

          Toast.fire({
            icon: "success",
            title: "User updated successfully"
          });

          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
        });
    },

    newModal() {
      this.editmode = false;
      this.form.reset();
      this.form.clear();
      $("#addNew").modal("show");
    },

    editModal(user) {
      this.editmode = true;
      this.form.reset();
      this.form.clear();
      $("#addNew").modal("show");
      this.form.fill(user);
    },

    loadUsers() {
      axios
        .get("/api/users")
        .then(({ data }) => (this.users = data.data))
        .catch(() => {
          this.$Progress.fail();
        });
    },

    createUser() {
      this.form
        .post("api/users")
        .then(() => {
          this.$Progress.start();

          Fire.$emit("emitChanges");

          $("#addNew").modal("hide");

          Toast.fire({
            icon: "success",
            title: "User created successfully"
          });

          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
        });
    },

    deleteUser(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        this.form
          .delete("api/users/" + id)
          .then(() => {
            if (result.value) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              Fire.$emit("emitChanges");
            }
          })
          .catch(() => {
            this.$Progress.fail();
            Swal.fire("Failed!", "Something went wrong", "warning");
          });
      });
    }
  },
  created() {
    this.loadUsers();
    Fire.$on("emitChanges", () => {
      setTimeout(() => {
        this.loadUsers();
      });
    });
  }
};
</script>

class UserModel {
  constructor(data = {}) {
    this.id = data.userId || null;
    this.email = data.userEmail || '';
    this.firstName = data.userFullName || '';
    this.role = data.role || 'USER';
    this.teamMemberShips = data.teamMemberships || null; // UUID
    this.token = data.token || null; 
  }
}

export default UserModel;

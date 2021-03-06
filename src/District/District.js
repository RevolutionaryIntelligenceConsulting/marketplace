import { Model } from 'decentraland-commons'
import uuid from 'uuid'

export class District extends Model {
  static tableName = 'districts'
  static columnNames = [
    'id',
    'name',
    'description',
    'link',
    'public',
    'parcel_count',
    'parcel_ids',
    'priority',
    'center',
    'disabled'
  ]

  static findEnabled() {
    return this.find({ disabled: false })
  }

  static findByName(name) {
    return this.findOne({ name })
  }

  static insert(project) {
    project.id = project.id || uuid.v4()
    return super.insert(project)
  }
}

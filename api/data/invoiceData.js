
const singleInvoiceData = {
  'sellerInfo': {
    '_id': '5bd17843da00d10147c03527',
    'name': 'East Repair Inc.',
    'address': '191 Harvest Lane, New York, NY 12210',
    'taxNo': '2300359001-001',
    'fax': '',
    'email': 'sale@eastrepair.com',
    'active': true,
    'bankAccountList':
    {
      'accountName': 'East Repair Inc.',
      'bankName': 'HSBC',
      'bankBranch': 'New York',
      'accountNo': '124000042084',
    },
    'phone': '+1 (646) 555-5584',
    'invoiceSignPerson': 'Peter Lane',
  },
  'boDate': new Date(),
  'signDate': new Date(),
  'fromDate': '2021-06-25T17:00:00.000Z',
  'toDate': '2021-07-27T17:00:00.000Z',
  'client': {
    'name': 'John Smith',
    'formattedAddress': '2 Counter Street, New York, NY 12210',
    'code': 'OCB00136',
    'taxNo': null,
  },
  'totalQuantity': 4,
  'fee': 45714,
  'taxFee': 2286,
  'totalFee': 48000,
  'taxPercent': 5,
  'details': [
    {
      'quantity': 4,
      'price': 7619,
      'description': 'Product A',
      'fee': 30476,
    },
    {
      'quantity': 2,
      'price': 7619,
      'description': 'Product B',
      'fee': 15238,
    },
  ],
};

module.exports = {singleInvoiceData};

# Given the network prefix = 10.0:
#
# AZ-1 (10.0.0.0/21)
#   Lambda   = 10.0.0.0/22
#   DMZ      = 10.0.4.0/25
#   Database = 10.0.4.128/25
#
# AZ-2 (10.0.8.0/21)
#   Lambda   = 10.0.8.0/22
#   DMZ      = 10.0.12.0/25
#   Database = 10.0.12.128/25
#
# AZ-N (10.0.${(N-1)*8}.0/21)
#   Lambda   = 10.0.${(N-1)*8}.0/22
#   DMZ      = 10.0.${(N-1)*8 + 4}.0/25
#   Database = 10.0.${(N-1)*8 + 4}.128/25

resource "aws_route_table" "dmz" {
  vpc_id = "${aws_vpc.vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.internet_gateway.id}"
  }

  tags {
    Name = "superbowleto DMZ Route Table"
  }
}

resource "aws_route_table_association" "dmz" {
  count = "${length(var.az_list)}"
  subnet_id = "${element(aws_subnet.dmz.*.id, count.index)}"
  route_table_id = "${aws_route_table.dmz.id}"
}

resource "aws_route_table" "lambda" {
  vpc_id = "${aws_vpc.vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.nat_gateway.id}"
  }

  tags {
    Name = "superbowleto Lambda Route Table"
  }
}

resource "aws_route_table_association" "lambda" {
  count = "${length(var.az_list)}"
  subnet_id = "${element(aws_subnet.lambda.*.id, count.index)}"
  route_table_id = "${aws_route_table.lambda.id}"
}

#--------------------------------------------------------------
# Subnets size calculations
#--------------------------------------------------------------
#
# There are 3 subnets for each Availability Zone:
#   - dmz (public): where the internet gateways will reside.
#   - lambda (private): where the lambda functions will reside.
#   - database (private); where the database will reside.
#
# The subnets size calculations were made based on the following premises:
#   - dmz subnet must have ~128 possible ips (cidr_block /25).
#   - lambda subnet must have ~2048 possible ips (cidr_block /21).
#   - database subnet must have ~128 possible ips (cidr_block /25).
#   - all availability zones must have identical-sized subnets.
#
# The subnet size calculations can be expressed as (given the network_prefix `10.0`):
#   AZ-1 (10.0.0.0/20)
#     lambda   = 10.0.0.0/21
#     dmz      = 10.0.8.0/25
#     database = 10.0.8.128/25
#   AZ-2 (10.0.16.0/20)
#     lambda   = 10.0.16.0/21
#     dmz      = 10.0.24.0/25
#     database = 10.0.24.128/25
#   AZ-N (10.0.${(N-1) * 16}.0/20)
#     lambda   = 10.0.${(N-1)* 16}.0/21
#     dmz      = 10.0.${(N-1)* 16 + 8}.0/25
#     database = 10.0.${(N-1)* 16 + 8}.128/25
#
#  Total Possible AZs: 16

resource "aws_subnet" "lambda" {
  count = "${length(var.az_list)}"
  vpc_id = "${aws_vpc.vpc.id}"
  cidr_block = "${var.network_prefix}.${count.index * 16}.0/22"
  map_public_ip_on_launch = false
  availability_zone = "${element(var.az_list, count.index)}"

  tags {
    Name = "superbowleto DMZ Subnet - AZ ${element(var.az_list, count.index)}"
    Public = "true"
  }
}

resource "aws_subnet" "dmz" {
  count = "${length(var.az_list)}"
  vpc_id = "${aws_vpc.vpc.id}"
  cidr_block = "${var.network_prefix}.${(count.index * 16) + 8}.0/25"
  map_public_ip_on_launch = true
  availability_zone = "${element(var.az_list, count.index)}"

  tags {
    Name = "superbowleto Lambda Subnet - AZ ${element(var.az_list, count.index)}"
    Public = "false"
  }
}

resource "aws_subnet" "database" {
  count = "${length(var.az_list)}"
  vpc_id = "${aws_vpc.vpc.id}"
  cidr_block = "${var.network_prefix}.${(count.index * 16) + 8}.128/25"
  map_public_ip_on_launch = false
  availability_zone = "${element(var.az_list, count.index)}"

  tags {
    Name = "superbowleto Database Subnet - AZ ${element(var.az_list, count.index)}"
    Public = "true"
  }
}

resource "aws_db_subnet_group" "database" {
  name = "superbowleto_database_subnet_group"
  description = "superbowleto Database Subnet Group"
  subnet_ids = ["${aws_subnet.database.*.id}"]

  tags {
    Name = "superbowleto Database Subnet Group"
  }
}
